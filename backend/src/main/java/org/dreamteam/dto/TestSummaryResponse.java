package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestSummaryResponse implements Serializable {
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
    private Boolean isShowResult;
}
