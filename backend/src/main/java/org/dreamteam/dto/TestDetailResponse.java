package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestDetailResponse {
    
    private UUID testId;
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
        private UUID questionId;
        private String questionText;
        private QuestionType questionType;
    }
}