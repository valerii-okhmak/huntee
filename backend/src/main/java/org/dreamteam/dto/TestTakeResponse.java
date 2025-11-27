package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TestTakeResponse {
    private Long attemptId;
    private Long testId;
    private String testName;
    private LocalDateTime endTime; // Час, коли спроба буде автоматично завершена
    private List<QuestionTakeResponse> questions;
}