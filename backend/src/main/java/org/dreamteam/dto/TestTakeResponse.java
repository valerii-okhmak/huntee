package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestTakeResponse {
    private UUID attemptId;
    private UUID testId;
    private String testName;
    private String sphere; 
    private Boolean isFixedTime;
    private OffsetDateTime endTime; 
    private Boolean hasCompletedAttempt;
    private List<QuestionTakeResponse> questions;
}