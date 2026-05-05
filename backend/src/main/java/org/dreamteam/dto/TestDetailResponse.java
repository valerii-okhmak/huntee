package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.dreamteam.Entity.QuestionType;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class TestDetailResponse implements Serializable {
    
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
    private Boolean isPrivate;  
    private List<QuestionSummary> questions;
    private Double maxScore;
    private Boolean isFixedQuestionOrder;
    private Boolean isFixedAnswerOrder;
    private Boolean isShowResult;

    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionSummary implements Serializable {
        private UUID questionId;
        private String questionText;
        private QuestionType questionType;
        private Double weight;
        private Integer orderIndex;
    }
}