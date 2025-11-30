package org.dreamteam.service;

import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.UserAnswer;
import org.dreamteam.Entity.UserTestAttempt;
import org.dreamteam.Entity.Test;
import org.dreamteam.repository.UserAnswerRepository;
import org.dreamteam.repository.UserTestAttemptRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledTaskService {

    private final UserTestAttemptRepository attemptRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final TestAttemptService testAttemptService; 

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoFinishExpiredTests() {
        List<UserTestAttempt> activeAttempts = attemptRepository.findByCompletedAtIsNull();
        LocalDateTime now = LocalDateTime.now();

        for (UserTestAttempt attempt : activeAttempts) {
            Test test = attempt.getTest();
            LocalDateTime deadline = calculateDeadline(attempt, test);

            if (deadline != null && now.isAfter(deadline.plusMinutes(2))) {
                forceFinishAttempt(attempt);
            }
        }
    }

    private LocalDateTime calculateDeadline(UserTestAttempt attempt, Test test) {
        LocalDateTime deadline = null;

        if (test.getDurationMinutes() != null && test.getDurationMinutes() > 0) {
            LocalDateTime personalDeadline = attempt.getStartedAt().plusMinutes(test.getDurationMinutes());
            
            if (!test.getIsFixedTime() && test.getEndTime() != null) {
                deadline = personalDeadline.isBefore(test.getEndTime()) ? personalDeadline : test.getEndTime();
            } else {
                deadline = personalDeadline;
            }
        } else {
            deadline = test.getEndTime();
        }
        return deadline;
    }

    private void forceFinishAttempt(UserTestAttempt attempt) {
        attempt.setCompletedAt(LocalDateTime.now());

        List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
        int totalQuestions = attempt.getTest().getTestQuestions().size();
        int correctCount = 0;

        for (UserAnswer answer : answers) {
            if (Boolean.TRUE.equals(answer.getIsCorrect())) {
                correctCount++;
            }
        }

        BigDecimal score = BigDecimal.ZERO;
        if (totalQuestions > 0) {
            score = BigDecimal.valueOf(correctCount)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
        }

        attempt.setScore(score);
        attemptRepository.save(attempt);
        
        System.out.println("Auto-finished test attempt ID: " + attempt.getAttemptId());
    }
}