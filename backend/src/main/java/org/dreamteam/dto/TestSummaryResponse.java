package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestSummaryResponse {
    private Long testId;
    private String testName;
    private String authorUsername;
    private int questionCount;
}
