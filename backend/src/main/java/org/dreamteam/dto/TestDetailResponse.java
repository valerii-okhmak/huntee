package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TestDetailResponse {
    
    private Long testId;
    private String testName;
    private String sphere;
    private String level;
    private String city;
    private String vacancyDescription;
    private String responsibilities;
    private Boolean isFixedTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String authorUsername;
    private List<QuestionSummary> questions;

    @Data
    @Builder
    public static class QuestionSummary {
        private Long questionId;
        private String questionText;
        private QuestionType questionType;
    }
}