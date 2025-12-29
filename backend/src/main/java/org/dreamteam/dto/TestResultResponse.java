package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class TestResultResponse {
    private UUID attemptId;
    private BigDecimal score; 
    private int totalQuestions;
    private int correctAnswers;
    private BigDecimal totalMaxScore;
}