package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.*;
import org.dreamteam.dto.*;
import org.dreamteam.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestAttemptService {

    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final UserTestAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserAnswerChoiceRepository userAnswerChoiceRepository;
    private final UserAnswerMatchingRepository userAnswerMatchingRepository;
    private final ChoiceOptionRepository choiceOptionRepository;
    private final TextAnswerRepository textAnswerRepository;
    private final MatchingPairRepository matchingPairRepository;
    private final TestInvitationService invitationService;
    private final TestAccessCodeRepository accessCodeRepository;
    
    private static final long TIME_BUFFER_SECONDS = 30;

    @Transactional
    public TestTakeResponse startTest(UUID testId, String userEmail, String invitationToken) {
        User user = findUserByEmail(userEmail);
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found: " + testId));

        OffsetDateTime now = OffsetDateTime.now();

        checkTestAvailabilityDates(test, now);

        UserTestAttempt completedAttempt = attemptRepository
                .findFirstByUserAndTestAndCompletedAtIsNotNullOrderByCompletedAtDesc(user, test)
                .orElse(null);

        boolean hasCompletedAttempt = (completedAttempt != null);
        UUID completedAttemptId = (completedAttempt != null) ? completedAttempt.getAttemptId() : null;
        

        UserTestAttempt attempt = attemptRepository
                .findByUserAndTestAndCompletedAtIsNull(user, test)
                .orElse(null);
        if (attempt == null) {
            if (Boolean.TRUE.equals(test.getIsPrivate())){
                validateAccessForPrivateTest(invitationToken, test, userEmail, user);
            }
            attempt = new UserTestAttempt(user, test);
            attempt.setStartedAt(OffsetDateTime.now());
            attempt = attemptRepository.save(attempt);
        }

        OffsetDateTime calculatedEndTime;

        if (Boolean.TRUE.equals(test.getIsFixedTime())) {
            OffsetDateTime durationLimit = test.getDurationMinutes() != null 
                    ? attempt.getStartedAt().plusSeconds(test.getDurationMinutes()) 
                    : null;

            if (durationLimit != null && test.getEndTime() != null) {
                calculatedEndTime = durationLimit.isBefore(test.getEndTime()) ? durationLimit : test.getEndTime();
            } else if (durationLimit != null) {
                calculatedEndTime = durationLimit;
            } else {
                calculatedEndTime = test.getEndTime();
            }
        } else {
            calculatedEndTime = test.getEndTime();
        }
        List<TestQuestion> questionsList = new java.util.ArrayList<>(test.getTestQuestions());
        if (Boolean.FALSE.equals(test.getIsFixedQuestionOrder())) {
            java.util.Collections.shuffle(questionsList);
        } else {
            questionsList.sort((q1, q2) -> {
                int idx1 = q1.getOrderIndex() != null ? q1.getOrderIndex() : Integer.MAX_VALUE;
                int idx2 = q2.getOrderIndex() != null ? q2.getOrderIndex() : Integer.MAX_VALUE;
                return Integer.compare(idx1, idx2);
            });
        }
        List<QuestionTakeResponse> questionResponses = questionsList.stream()
                .map(testQuestion -> mapToQuestionTakeResponse(
                        testQuestion.getQuestion(), 
                        test.getIsFixedAnswerOrder()
                    ))
                .collect(Collectors.toList());

        return TestTakeResponse.builder()
                .attemptId(attempt.getAttemptId())
                .testId(test.getTestId())
                .sphere(test.getSphere())
                .testName(test.getTestName())
                .isFixedTime(test.getIsFixedTime())
                .endTime(calculatedEndTime)
                .questions(questionResponses)
                .hasCompletedAttempt(hasCompletedAttempt)
                .completedAttemptId(completedAttemptId)
                .build();
    }

@Transactional
    public void submitAnswer(UUID attemptId, UUID questionId, AnswerSubmissionRequest request, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        checkAttemptOwnership(attempt, userEmail);

        if (attempt.getCompletedAt() != null) {
             throw new AccessDeniedException("This test attempt has already been completed.");
        }

        validateTimeLimit(attempt);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found: " + questionId));

        if (question.getQuestionType() != request.getQuestionType()) {
            throw new IllegalArgumentException("Question type mismatch.");
        }

        UserAnswer userAnswer = userAnswerRepository
                .findByAttempt_AttemptIdAndQuestion_QuestionId(attemptId, questionId)
                .orElse(new UserAnswer(attempt, question));

        if (userAnswer.getChoices() == null) userAnswer.setChoices(new HashSet<>());
        else userAnswer.getChoices().clear();

        if (userAnswer.getMatchings() == null) userAnswer.setMatchings(new HashSet<>());
        else userAnswer.getMatchings().clear();
        userAnswerRepository.saveAndFlush(userAnswer);

        switch (request.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                if (request.getSelectedOptionIds() != null) {
                    for (Long optionId : request.getSelectedOptionIds()) {
                        ChoiceOption option = choiceOptionRepository.findById(optionId)
                                .orElseThrow(() -> new EntityNotFoundException("Option not found: " + optionId));
                        userAnswer.getChoices().add(new UserAnswerChoice(userAnswer, option));
                    }
                }
                break;

            case TEXT:
                userAnswer.setGivenText(request.getGivenText());
                break;

            case MATCHING:
                if (request.getMatchingAnswers() != null) {
                    for (AnswerSubmissionRequest.MatchingAnswerDTO match : request.getMatchingAnswers()) {
                        MatchingPair pair = matchingPairRepository.findById(match.getPromptPairId())
                                .orElseThrow(() -> new EntityNotFoundException("Matching pair not found: " + match.getPromptPairId()));
                        userAnswer.getMatchings().add(new UserAnswerMatching(userAnswer, pair, match.getSelectedAnswerText()));
                    }
                }
                break;

            case CODE:
                userAnswer.setGivenText(request.getGivenText());
                break;
        }

        userAnswerRepository.save(userAnswer);
    }

    @Transactional
    public TestResultResponse finishTest(UUID attemptId, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        checkAttemptOwnership(attempt, userEmail);

        if (attempt.getStatus() == AttemptStatus.COMPLETED || attempt.getStatus() == AttemptStatus.PENDING_REVIEW) {
            return calculateResult(attempt); 
        }

        attempt.setCompletedAt(OffsetDateTime.now());
        List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attemptId);

        boolean hasManualQuestions = attempt.getTest().getTestQuestions().stream()
                .anyMatch(tq -> tq.getQuestion().getQuestionType() == QuestionType.TEXT);

        BigDecimal currentAutoScore = BigDecimal.ZERO;

        for (TestQuestion tq : attempt.getTest().getTestQuestions()) {
            Question q = tq.getQuestion();
            UserAnswer answer = answers.stream()
                    .filter(a -> a.getQuestion().getQuestionId().equals(q.getQuestionId()))
                    .findFirst()
                    .orElse(null);

            if (answer != null) {
                if (q.getQuestionType() == QuestionType.TEXT) {
                    answer.setIsCorrect(null);
                    answer.setAwardedScore(null);
                } else {
                    boolean isCorrect = gradeAnswer(answer);
                    answer.setIsCorrect(isCorrect);
                    
                    if (isCorrect) {
                        BigDecimal weight = BigDecimal.valueOf(q.getCustomWeight() != null ? q.getCustomWeight() : 1.0);
                        answer.setAwardedScore(weight); 
                        currentAutoScore = currentAutoScore.add(weight);
                    } else {
                        answer.setAwardedScore(BigDecimal.ZERO);
                    }
                }
                userAnswerRepository.save(answer);
            }
        }

        if (hasManualQuestions) {
            attempt.setStatus(AttemptStatus.PENDING_REVIEW);
            attempt.setScore(null); 
            attemptRepository.save(attempt);

            return TestResultResponse.builder()
                    .attemptId(attemptId)
                    .score(null) 
                    .isShown(false) 
                    .build(); 
        } else {
            attempt.setStatus(AttemptStatus.COMPLETED);
            attempt.setScore(currentAutoScore.setScale(2, RoundingMode.HALF_UP));
            attemptRepository.save(attempt);
            return calculateResult(attempt);
        }
    }
    
    @Transactional(readOnly = true)
    public TestAttemptReviewResponse getAttemptReview(UUID attemptId, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        User requester = findUserByEmail(userEmail);

        boolean isCandidate = attempt.getUser().getId().equals(requester.getId());
        boolean isOwner = attempt.getTest().getUser().getId().equals(requester.getId());

        boolean showResult = attempt.getTest().getIsShowResult();

        if (!isCandidate && !isOwner) {
            showResult = false;
            
        }

        if (isCandidate && !isOwner && Boolean.FALSE.equals(attempt.getTest().getIsShowResult())) {
            showResult = false;
        }

        

        java.util.Map<UUID, UserAnswer> answerMap = attempt.getUserAnswers().stream()
            .collect(Collectors.toMap(
                a -> a.getQuestion().getQuestionId(), 
                a -> a,
                (existing, replacement) -> existing
            ));
        
        List<TestAttemptReviewResponse.QuestionReviewDTO> questions = attempt.getTest().getTestQuestions().stream()
                .sorted((q1, q2) -> {
                     int idx1 = q1.getOrderIndex() != null ? q1.getOrderIndex() : Integer.MAX_VALUE;
                     int idx2 = q2.getOrderIndex() != null ? q2.getOrderIndex() : Integer.MAX_VALUE;
                     return Integer.compare(idx1, idx2);
                })
                .map(tq -> {
                    Question q = tq.getQuestion();
                    UserAnswer answer = answerMap.get(q.getQuestionId());
                    return mapToQuestionReview(q, answer); 
                })
                .collect(Collectors.toList());

        int correctCount = (int) attempt.getUserAnswers().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                .count();
        
        int totalQuestions = attempt.getTest().getTestQuestions().size();

        BigDecimal totalMaxScore = attempt.getTest().getTestQuestions().stream()
         .map(tq -> {
         Double w = tq.getQuestion().getCustomWeight();
         return (w != null) ? BigDecimal.valueOf(w) 
                            : BigDecimal.ONE; 
    })
        .reduce(BigDecimal.ZERO, BigDecimal::add);


        return TestAttemptReviewResponse.builder()
                .attemptId(attempt.getAttemptId())
                .candidateName(getFullName(attempt.getUser()))
                .candidateEmail(attempt.getUser().getEmail()) 
                .authorEmail(attempt.getTest().getUser().getEmail())
                .testName(attempt.getTest().getTestName())    
                .sphere(attempt.getTest().getSphere())       
                
                .completedAt(attempt.getCompletedAt())        
                .score(attempt.getScore())
                .totalMaxScore(totalMaxScore)
                .totalQuestions(totalQuestions)               
                .correctAnswersCount(correctCount)
                .isShown(showResult)
                .endTime(attempt.getTest().getEndTime())     
                .questions(questions)
                .build();
    }


    @Transactional 
    public TestResultResponse finalizeAttemptGrading(UUID attemptId, String authorEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        
        if (!attempt.getTest().getUser().getEmail().equals(authorEmail)) {
            throw new AccessDeniedException("Only the test owner can finalize grading.");
        }

        BigDecimal totalScore = BigDecimal.ZERO;
        List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attemptId);

        for (UserAnswer ans : answers) {
            if (ans.getAwardedScore() != null) {
                totalScore = totalScore.add(ans.getAwardedScore());
            }
        }

        attempt.setScore(totalScore.setScale(2, RoundingMode.HALF_UP));
        attempt.setStatus(AttemptStatus.COMPLETED);
        attemptRepository.save(attempt);
        
        return calculateResult(attempt);
    }



    @Transactional
    public void gradeAnswerManually(UUID attemptId, UUID questionId, BigDecimal points, String comment, String authorEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        
        if (!attempt.getTest().getUser().getEmail().equals(authorEmail)) {
            throw new AccessDeniedException("Only the test owner can grade answers.");
        }

        UserAnswer answer = userAnswerRepository.findByAttempt_AttemptIdAndQuestion_QuestionId(attemptId, questionId)
                .orElseThrow(() -> new EntityNotFoundException("Answer not found for question: " + questionId));

        Question q = answer.getQuestion();
        BigDecimal maxWeight = BigDecimal.valueOf(q.getCustomWeight() != null ? q.getCustomWeight() : 1.0);

        if (points.compareTo(maxWeight) > 0) {
            throw new IllegalArgumentException("Score cannot exceed the question weight (" + maxWeight + ")");
        }

        answer.setAwardedScore(points);
        answer.setTeacherComment(comment);
        
        answer.setIsCorrect(points.compareTo(BigDecimal.ZERO) > 0);

        userAnswerRepository.save(answer);
    }






    private String getFullName(User user) {
        if (user.getProfile() != null) {
            return user.getProfile().getFirstName() + " " + user.getProfile().getLastName();
        }
        return "User";
    }

    private void validateTimeLimit(UserTestAttempt attempt) {
        Test test = attempt.getTest();
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime deadline;

        if (test.getDurationMinutes() != null && test.getDurationMinutes() > 0) {
            OffsetDateTime personalDeadline = attempt.getStartedAt().plusSeconds(test.getDurationMinutes());
            if (!Boolean.TRUE.equals(test.getIsFixedTime()) && test.getEndTime() != null) {
                deadline = personalDeadline.isBefore(test.getEndTime()) ? personalDeadline : test.getEndTime();
            } else {
                deadline = personalDeadline;
            }
        } else {
            deadline = test.getEndTime();
        }

        if (deadline == null) return;

        if (now.isAfter(deadline.plusSeconds(TIME_BUFFER_SECONDS))) {
            throw new AccessDeniedException("Time limit exceeded.");
        }
    }

    private boolean gradeAnswer(UserAnswer userAnswer) {
        Question question = userAnswer.getQuestion();

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                Set<Long> correctOptionIds = choiceOptionRepository.findByQuestionAndIsCorrectTrue(question)
                        .stream().map(ChoiceOption::getOptionId).collect(Collectors.toSet());
                Set<Long> givenOptionIds = userAnswer.getChoices().stream()
                        .map(choice -> choice.getSelectedOption().getOptionId()).collect(Collectors.toSet());
                return correctOptionIds.equals(givenOptionIds);

            case TEXT:
                TextAnswer textAnswer = textAnswerRepository.findByQuestion_QuestionId(question.getQuestionId())
                        .orElse(null);
                if (textAnswer == null) return false;

                String correctText = textAnswer.getCorrectText();
                String givenText = userAnswer.getGivenText();
                if (givenText == null) return false;

                return textAnswer.isCaseSensitive()
                        ? correctText.equals(givenText)
                        : correctText.equalsIgnoreCase(givenText.trim());

            case MATCHING:
                Set<MatchingPair> correctPairs = question.getMatchingPairs();
                Set<UserAnswerMatching> givenMatches = userAnswer.getMatchings();
                if (correctPairs.size() != givenMatches.size()) return false;

                for (MatchingPair correctPair : correctPairs) {
                    boolean foundMatch = givenMatches.stream()
                            .anyMatch(given -> given.getMatchingPair().equals(correctPair) &&
                                    given.getSelectedAnswerText().equals(correctPair.getAnswer()));
                    if (!foundMatch) return false;
                }
                return true;

            case CODE:
                String code = userAnswer.getGivenText();
                if (code == null || code.trim().isEmpty()) return false;
                return code.length() > 10;

            default:
                return false;
        }
    }

    private QuestionTakeResponse mapToQuestionTakeResponse(Question question, Boolean isFixedAnswerOrder) {
        QuestionTakeResponse.QuestionTakeResponseBuilder builder = QuestionTakeResponse.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .comment(question.getComment());

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                java.util.List<ChoiceOption> optionsList = new java.util.ArrayList<>(question.getChoiceOptions());
                if (Boolean.FALSE.equals(isFixedAnswerOrder)) {
                    java.util.Collections.shuffle(optionsList);
                } else {
                    optionsList.sort(java.util.Comparator.comparing(ChoiceOption::getOptionId));
                }
                builder.choiceOptions(optionsList.stream()
                        .map(o -> QuestionTakeResponse.ChoiceOptionTakeDTO.builder()
                                .optionId(o.getOptionId())
                                .optionText(o.getOptionText())
                                .build())
                        .collect(Collectors.toList()));
                break;
            case MATCHING:
                java.util.List<MatchingPair> pairsList = new java.util.ArrayList<>(question.getMatchingPairs());

                if (Boolean.FALSE.equals(isFixedAnswerOrder)) {
                    java.util.Collections.shuffle(pairsList);
                } else {
                    pairsList.sort(java.util.Comparator.comparing(MatchingPair::getPairId));
                }

                builder.matchingPrompts(pairsList.stream()
                        .map(p -> QuestionTakeResponse.MatchingPromptDTO.builder()
                                .pairId(p.getPairId())
                                .prompt(p.getPrompt())
                                .build())
                        .collect(Collectors.toList()));
                break;
            case CODE:
                if (question.getCodeAnswer() != null) {
                    builder.templateCode(question.getCodeAnswer().getTemplateCode());
                    builder.codeLanguage(question.getCodeAnswer().getLanguage());
                }
                break;
            case TEXT:
                break;
        }
        return builder.build();
    }

    
    private TestAttemptReviewResponse.QuestionReviewDTO mapToQuestionReview(Question q, UserAnswer answer) {
    boolean isAnswerPresent = (answer != null);
    boolean isCorrect = isAnswerPresent && Boolean.TRUE.equals(answer.getIsCorrect());

    TestAttemptReviewResponse.QuestionReviewDTO.QuestionReviewDTOBuilder builder = TestAttemptReviewResponse.QuestionReviewDTO.builder()
            .questionId(q.getQuestionId())
            .questionText(q.getQuestionText())
            .type(q.getQuestionType())
            .comment(q.getComment())
            .weight(q.getCustomWeight() != null ? q.getCustomWeight() : 1.0)
            .isCorrect(isCorrect);

    switch (q.getQuestionType()) {
        case SINGLE_CHOICE:
        case MULTIPLE_CHOICE:
            List<ChoiceOptionDTO> allOptions = q.getChoiceOptions().stream()
                    .map(o -> new ChoiceOptionDTO(o.getOptionId(), o.getOptionText(), o.getImageUrl(), o.isCorrect()))
                    .collect(Collectors.toList());

            List<Long> userSelectedIds = isAnswerPresent 
                    ? answer.getChoices().stream()
                        .map(c -> c.getSelectedOption().getOptionId())
                        .collect(Collectors.toList())
                    : java.util.Collections.emptyList();

            List<Long> correctIds = q.getChoiceOptions().stream()
                    .filter(ChoiceOption::isCorrect)
                    .map(ChoiceOption::getOptionId)
                    .collect(Collectors.toList());

            builder.options(allOptions)
                    .selectedOptionIds(userSelectedIds)
                    .correctOptionIds(correctIds)
                    .userAnswer(isAnswerPresent ? "" : "(Немає відповіді)") 
                    .correctAnswer("");
            break;

        case TEXT:
            builder.userAnswer(isAnswerPresent ? answer.getGivenText() : "(Немає відповіді)");
            
            textAnswerRepository.findByQuestion_QuestionId(q.getQuestionId())
                    .ifPresent(ta -> builder.correctAnswer(ta.getCorrectText()));
            break;

        case MATCHING:
            String userMatches = isAnswerPresent 
                    ? answer.getMatchings().stream()
                        .map(m -> m.getMatchingPair().getPrompt() + " — " + m.getSelectedAnswerText())
                        .collect(Collectors.joining("\n"))
                    : "(Немає відповіді)";
            
            String correctMatches = q.getMatchingPairs().stream()
                    .map(p -> p.getPrompt() + " — " + p.getAnswer())
                    .collect(Collectors.joining("\n"));

            builder.userAnswer(userMatches)
                   .correctAnswer(correctMatches);
            break;

        case CODE:
            builder.userCode(isAnswerPresent ? answer.getGivenText() : "");
            builder.userAnswer(isAnswerPresent ? "Code submitted" : "(Немає відповіді)");

            if (q.getCodeAnswer() != null) {
                builder.language(q.getCodeAnswer().getLanguage());
                builder.templateCode(q.getCodeAnswer().getTemplateCode());
                builder.testCases(q.getCodeAnswer().getTestCases());
                builder.correctAnswer("Див. тест-кейси");
            }
            break;
    }

    return builder.build();
}

    private TestResultResponse calculateResult(UserTestAttempt attempt) {
        int totalQuestions = attempt.getTest().getTestQuestions().size();
        long correctCount = attempt.getUserAnswers().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                .count();
                
        BigDecimal totalMaxScore = attempt.getTest().getTestQuestions().stream()
            .map(tq -> {
                Double w = tq.getQuestion().getCustomWeight();
                return (w != null) ? BigDecimal.valueOf(w) : BigDecimal.ONE;
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .setScale(2, RoundingMode.HALF_UP);

        return TestResultResponse.builder()
                .attemptId(attempt.getAttemptId())
                .score(attempt.getScore())
                .totalQuestions(totalQuestions)
                .totalMaxScore(totalMaxScore)
                .correctAnswers((int) correctCount)
                .build();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private UserTestAttempt findAttemptById(UUID attemptId) {
        return attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Test attempt not found: " + attemptId));
    }

    private void checkAttemptOwnership(UserTestAttempt attempt, String email) {
        if (!attempt.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to access this test attempt.");
        }
    }


private void checkTestAvailabilityDates(Test test, OffsetDateTime now) {
            if (test.getStartTime() != null && now.isBefore(test.getStartTime())) {
                throw new AccessDeniedException("Тест ще не розпочався.");
            }
}


private void validateAccessForPrivateTest(String token, Test test, String userEmail, User user) {
        boolean hasValidEmailToken = false;
        String tokenErrorMsg = null;

        if (token != null && !token.isBlank()) {
            try {
                TestInvitation invitation = invitationService.validateAndConsumeToken(token);
                if (!invitation.getTest().getTestId().equals(test.getTestId())) {
                    tokenErrorMsg = "This invitation token is not valid for this test.";
                } else if (!invitation.getEmail().equalsIgnoreCase(userEmail)) {
                    tokenErrorMsg = "This invitation token is not associated with your email.";
                } else {
                    hasValidEmailToken = true;
                }
            } catch (Exception e) {
                tokenErrorMsg = "Invalid or used invitation token.";
            }
        }

        if (!hasValidEmailToken) {
            boolean hasUsedAccessCode = accessCodeRepository
                    .findByTest_TestIdAndUsedByUser_Id(test.getTestId(), user.getId())
                    .isPresent();

            if (!hasUsedAccessCode) {
                if (tokenErrorMsg != null) {
                    throw new AccessDeniedException(tokenErrorMsg); 
                } else {
                    throw new AccessDeniedException("This test is private. An invitation token or access code is required.");
                }
            }
        }
}
}