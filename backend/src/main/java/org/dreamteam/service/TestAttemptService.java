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
import java.time.LocalDateTime;
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
    
    private static final long TIME_BUFFER_SECONDS = 30;

    @Transactional
    public TestTakeResponse startTest(UUID testId, String userEmail) {
        User user = findUserByEmail(userEmail);
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found: " + testId));

        OffsetDateTime now = OffsetDateTime.now();

        // Перевірка доступності тесту для нефіксованого часу
        if (!Boolean.TRUE.equals(test.getIsFixedTime())) {
            if (test.getStartTime() != null && now.isBefore(test.getStartTime())) {
                throw new AccessDeniedException("Test has not started yet.");
            }
            if (test.getEndTime() != null && now.isAfter(test.getEndTime())) {
                throw new AccessDeniedException("Test has already finished.");
            }
        }

        // Створюємо або отримуємо існуючу спробу
        UserTestAttempt attempt = attemptRepository
                .findByUserAndTestAndCompletedAtIsNull(user, test)
                .orElseGet(() -> {
                    UserTestAttempt newAttempt = new UserTestAttempt(user, test);
                    // зберігаємо дату старту
                    newAttempt.setStartedAt(OffsetDateTime.now());
                    return attemptRepository.save(newAttempt);
                });

        // Тепер обчислюємо calculatedEndTime
        OffsetDateTime calculatedEndTime;

        if (Boolean.TRUE.equals(test.getIsFixedTime())) {
            // Фіксований час: беремо мінімум між startedAt + duration та endTime
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
            // Нефіксований час: просто повертаємо endTime
            calculatedEndTime = test.getEndTime();
        }

        List<QuestionTakeResponse> questionResponses = test.getTestQuestions().stream()
                .map(testQuestion -> mapToQuestionTakeResponse(testQuestion.getQuestion()))
                .collect(Collectors.toList());

        return TestTakeResponse.builder()
                .attemptId(attempt.getAttemptId())
                .testId(test.getTestId())
                .sphere(test.getSphere())
                .testName(test.getTestName())
                .endTime(calculatedEndTime)
                .questions(questionResponses)
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

        userAnswer.getChoices().clear();
        userAnswer.getMatchings().clear();
        userAnswerChoiceRepository.deleteAll(userAnswer.getChoices());
        userAnswerMatchingRepository.deleteAll(userAnswer.getMatchings());

        switch (request.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                Set<UserAnswerChoice> choices = new HashSet<>();
                if (request.getSelectedOptionIds() != null) {
                    for (Long optionId : request.getSelectedOptionIds()) {
                        ChoiceOption option = choiceOptionRepository.findById(optionId)
                                .orElseThrow(() -> new EntityNotFoundException("Option not found: " + optionId));
                        choices.add(new UserAnswerChoice(userAnswer, option));
                    }
                }
                userAnswer.setChoices(choices);
                break;
            case TEXT:
                userAnswer.setGivenText(request.getGivenText());
                break;
            case MATCHING:
                Set<UserAnswerMatching> matchings = new HashSet<>();
                if (request.getMatchingAnswers() != null) {
                    for (AnswerSubmissionRequest.MatchingAnswerDTO match : request.getMatchingAnswers()) {
                        MatchingPair pair = matchingPairRepository.findById(match.getPromptPairId())
                                .orElseThrow(() -> new EntityNotFoundException("Matching pair not found: " + match.getPromptPairId()));
                        matchings.add(new UserAnswerMatching(userAnswer, pair, match.getSelectedAnswerText()));
                    }
                }
                userAnswer.setMatchings(matchings);
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

        if (attempt.getCompletedAt() != null) {
            return calculateResult(attempt);
        }

        attempt.setCompletedAt(OffsetDateTime.now());

        List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attemptId);
        int totalQuestions = attempt.getTest().getTestQuestions().size();
        int correctCount = 0;

        for (UserAnswer answer : answers) {
            boolean isCorrect = gradeAnswer(answer);
            answer.setIsCorrect(isCorrect);
            if (isCorrect) {
                correctCount++;
            }
            userAnswerRepository.save(answer);
        }

        BigDecimal score = BigDecimal.ZERO;
        if (totalQuestions > 0) {
            score = BigDecimal.valueOf(correctCount)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
        }

        attempt.setScore(score);
        attemptRepository.save(attempt);

        return TestResultResponse.builder()
                .attemptId(attemptId)
                .score(score)
                .totalQuestions(totalQuestions)
                .correctAnswers(correctCount)
                .build();
    }

    @Transactional(readOnly = true)
    public TestAttemptReviewResponse getAttemptReview(UUID attemptId, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        User requester = findUserByEmail(userEmail);

        boolean isCandidate = attempt.getUser().getId().equals(requester.getId());
        boolean isOwner = attempt.getTest().getUser().getId().equals(requester.getId());

        if (!isCandidate && !isOwner) {
            throw new AccessDeniedException("Access denied");
        }

        int correctCount = (int) attempt.getUserAnswers().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                .count();
        
        int totalQuestions = attempt.getTest().getTestQuestions().size();

        List<TestAttemptReviewResponse.QuestionReviewDTO> questions = attempt.getUserAnswers().stream()
                .map(this::mapToQuestionReview)
                .collect(Collectors.toList());

        return TestAttemptReviewResponse.builder()
                .attemptId(attempt.getAttemptId())
                .candidateName(getFullName(attempt.getUser()))
                .candidateEmail(attempt.getUser().getEmail()) 
                
                .testName(attempt.getTest().getTestName())    
                .sphere(attempt.getTest().getSphere())       
                
                .completedAt(attempt.getCompletedAt())        
                .score(attempt.getScore())
                .totalQuestions(totalQuestions)               
                .correctAnswersCount(correctCount)           
                
                .questions(questions)
                .build();
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

    private QuestionTakeResponse mapToQuestionTakeResponse(Question question) {
        QuestionTakeResponse.QuestionTakeResponseBuilder builder = QuestionTakeResponse.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .comment(question.getComment());

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                builder.choiceOptions(question.getChoiceOptions().stream()
                        .map(o -> QuestionTakeResponse.ChoiceOptionTakeDTO.builder()
                                .optionId(o.getOptionId())
                                .optionText(o.getOptionText())
                                .build())
                        .collect(Collectors.toList()));
                break;
            case MATCHING:
                builder.matchingPrompts(question.getMatchingPairs().stream()
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

    
    private TestAttemptReviewResponse.QuestionReviewDTO mapToQuestionReview(UserAnswer answer) {
        Question q = answer.getQuestion();
        
        TestAttemptReviewResponse.QuestionReviewDTO.QuestionReviewDTOBuilder builder = TestAttemptReviewResponse.QuestionReviewDTO.builder()
                .questionId(q.getQuestionId())
                .questionText(q.getQuestionText())
                .type(q.getQuestionType())
                .comment(q.getComment())
                .isCorrect(Boolean.TRUE.equals(answer.getIsCorrect()));

        switch (q.getQuestionType()) {
            case SINGLE_CHOICE:
            case MULTIPLE_CHOICE:
                List<ChoiceOptionDTO> allOptions = q.getChoiceOptions().stream()
                        .map(o -> new ChoiceOptionDTO(o.getOptionId(), o.getOptionText(), o.getImageUrl(), o.isCorrect()))
                        .collect(Collectors.toList());
                
                List<Long> userSelectedIds = answer.getChoices().stream()
                        .map(c -> c.getSelectedOption().getOptionId())
                        .collect(Collectors.toList());

                List<Long> correctIds = choiceOptionRepository.findByQuestionAndIsCorrectTrue(q)
                        .stream().map(ChoiceOption::getOptionId)
                        .collect(Collectors.toList());

                builder.options(allOptions)
                       .selectedOptionIds(userSelectedIds)
                       .correctOptionIds(correctIds);
                
                builder.userAnswer(""); 
                builder.correctAnswer("");
                break;

            case TEXT:
                builder.userAnswer(answer.getGivenText());
                textAnswerRepository.findByQuestion_QuestionId(q.getQuestionId())
                        .ifPresent(ta -> builder.correctAnswer(ta.getCorrectText()));
                break;

            case MATCHING:
                String userMatches = answer.getMatchings().stream()
                        .map(m -> m.getMatchingPair().getPrompt() + " — " + m.getSelectedAnswerText())
                        .collect(Collectors.joining("\n"));
                String correctMatches = q.getMatchingPairs().stream()
                        .map(p -> p.getPrompt() + " — " + p.getAnswer())
                        .collect(Collectors.joining("\n"));
                
                builder.userAnswer(userMatches)
                       .correctAnswer(correctMatches);
                break;

            case CODE:
                builder.userCode(answer.getGivenText());
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

        return TestResultResponse.builder()
                .attemptId(attempt.getAttemptId())
                .score(attempt.getScore())
                .totalQuestions(totalQuestions)
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
}