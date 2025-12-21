package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
public class TestSummaryResponse {
    private UUID testId;
    private String testName;
    private String sphere;
    private String level;
    private String city;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Boolean isFixedTime;
    private String authorUsername;
    private Boolean isPrivate;
}
