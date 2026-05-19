package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestTakeResponse {
    private UUID attemptId;
    private UUID testId;
    private String testName;
    private String sphere; 
    private Boolean isFixedTime;
    private OffsetDateTime endTime;
    private List<TestLevelDTO> levels;
    private Boolean hasCompletedAttempt;
    private UUID completedAttemptId;
    private List<QuestionTakeResponse> questions;
}