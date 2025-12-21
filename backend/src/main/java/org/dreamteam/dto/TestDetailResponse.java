package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Integer durationMinutes;
    private String authorUsername;
    @JsonProperty("is_private")
    private Boolean isPrivate;  
    private List<QuestionSummary> questions;

    @Data
    @Builder
    public static class QuestionSummary {
        private UUID questionId;
        private String questionText;
        private QuestionType questionType;
    }
}