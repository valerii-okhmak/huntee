package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class TestAdvancedAnalyticsDTO {
    private Map<String, Double> skillsProfile;

    private Map<String, Integer> scoreDistribution;

    private List<QuestionPerformanceDTO> hardestQuestions;

    private List<TimeScorePoint> timeVsScore;

    @Data
    @Builder
    public static class QuestionPerformanceDTO {
        private String questionText;
        private QuestionType type;
        private double correctPercentage; 
    }

    @Data
    @Builder
    public static class TimeScorePoint {
        private Long durationSeconds; 
        private Double score;         
        private String candidateName; 
    }
}