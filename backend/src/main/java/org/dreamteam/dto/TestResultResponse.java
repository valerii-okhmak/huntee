package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class TestResultResponse {
    private Long attemptId;
    private BigDecimal score; 
    private int totalQuestions;
    private int correctAnswers;
}