package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestTakeResponse {
    private UUID attemptId;
    private UUID testId;
    private String testName;
    private String sphere; 
    private LocalDateTime endTime; 
    private List<QuestionTakeResponse> questions;
}