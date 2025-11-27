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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    
    @Transactional
    public TestTakeResponse startTest(Long testId, String userEmail) {
        User user = findUserByEmail(userEmail);
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found: " + testId));

        LocalDateTime now = LocalDateTime.now();
        if (!test.getIsFixedTime()) {
            if (test.getStartTime() != null && now.isBefore(test.getStartTime())) {
                throw new AccessDeniedException("Test has not started yet.");
            }
            if (test.getEndTime() != null && now.isAfter(test.getEndTime())) {
                throw new AccessDeniedException("Test has already finished.");
            }
        }
        
        UserTestAttempt attempt = new UserTestAttempt(user, test);
        UserTestAttempt savedAttempt = attemptRepository.save(attempt);

        LocalDateTime endTime = (test.getDurationMinutes() != null)
                ? now.plusMinutes(test.getDurationMinutes())
                : test.getEndTime();

        List<QuestionTakeResponse> questionResponses = test.getTestQuestions().stream()
                .map(testQuestion -> mapToQuestionTakeResponse(testQuestion.getQuestion()))
                .collect(Collectors.toList());

        return TestTakeResponse.builder()
                .attemptId(savedAttempt.getAttemptId())
                .testId(test.getTestId())
                .testName(test.getTestName())
                .endTime(endTime)
                .questions(questionResponses)
                .build();
    }

    @Transactional
    public void submitAnswer(Long attemptId, Long questionId, AnswerSubmissionRequest request, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        checkAttemptOwnership(attempt, userEmail);

        if (attempt.getCompletedAt() != null) {
            throw new AccessDeniedException("This test attempt has already been completed.");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found: " + questionId));

        if (question.getQuestionType() != request.getQuestionType()) {
            throw new IllegalArgumentException("Question type mismatch.");
        }

        UserAnswer userAnswer = userAnswerRepository
                .findByAttempt_AttemptIdAndQuestion_QuestionId(attemptId, questionId)
                .orElse(new UserAnswer(attempt, question));
                
        userAnswerChoiceRepository.deleteAll(userAnswer.getChoices());
        userAnswerMatchingRepository.deleteAll(userAnswer.getMatchings());
        userAnswer.getChoices().clear();
        userAnswer.getMatchings().clear();

        switch (request.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
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
    public TestResultResponse finishTest(Long attemptId, String userEmail) {
        UserTestAttempt attempt = findAttemptById(attemptId);
        checkAttemptOwnership(attempt, userEmail);

        if (attempt.getCompletedAt() != null) {
            throw new AccessDeniedException("This test attempt has already been completed.");
        }

        attempt.setCompletedAt(LocalDateTime.now());
        
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
                return false; 

            default:
                return false;
        }
    }

    private QuestionTakeResponse mapToQuestionTakeResponse(Question question) {
        QuestionTakeResponse.QuestionTakeResponseBuilder builder = QuestionTakeResponse.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType());

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
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
                }
                break;
            case TEXT:
                break;
        }
        return builder.build();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private UserTestAttempt findAttemptById(Long attemptId) {
        return attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Test attempt not found: " + attemptId));
    }

    private void checkAttemptOwnership(UserTestAttempt attempt, String email) {
        if (!attempt.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to access this test attempt.");
        }
    }
}