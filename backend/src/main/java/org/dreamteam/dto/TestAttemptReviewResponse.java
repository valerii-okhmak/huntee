package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class TestAttemptReviewResponse {
    private Long attemptId;
    private String candidateName;
    private BigDecimal score;
    private List<QuestionReviewDTO> questions;

    @Data
    @Builder
    public static class QuestionReviewDTO {
        private String questionText;
        private QuestionType type;
        private boolean isCorrect;
        private String userAnswer;    
        private String correctAnswer; 
        private String comment;      
    }
}