package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.util.List;

@Data
@Builder
public class TestDetailResponse {
    private Long testId;
    private String testName;
    private String description;
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
