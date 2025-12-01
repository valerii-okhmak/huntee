package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CodeRunResponse {
    private boolean allPassed;
    private List<TestCaseResult> results;

    @Data
    @Builder
    public static class TestCaseResult {
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private boolean passed;
        private String error; // Якщо була помилка компіляції
    }
}