package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TestSummaryResponse {
    private Long testId;
    private String testName;
    private String sphere;
    private String level;
    private String city;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isFixedTime;
    private String authorUsername;
}
