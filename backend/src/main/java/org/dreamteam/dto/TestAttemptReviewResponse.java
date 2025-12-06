package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestAttemptReviewResponse {
    private UUID attemptId;
    private String candidateName;
    private String candidateEmail;
    private LocalDateTime completedAt;
    
    private String testName;
    private String sphere;
    
    private BigDecimal score;
    private Integer totalQuestions;
    private Integer correctAnswersCount;

    private List<QuestionReviewDTO> questions;

    @Data
    @Builder
    public static class QuestionReviewDTO {
        private UUID questionId;
        private String questionText;
        private QuestionType type;
        private String comment;
        private boolean isCorrect;

        private String userAnswer; 
        private String correctAnswer;
        
        private List<ChoiceOptionDTO> options; 
        
        private List<Long> selectedOptionIds; 
        
        private List<Long> correctOptionIds;

        private String userCode;
        private String templateCode;
        private String language;
        private String testCases;
    }
}