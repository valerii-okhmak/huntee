package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TestCreateRequest {
    
    private String testName;
    private String sphere;
    private String level;
    private String city;
    private String vacancyDescription;
    private String responsibilities;
    private boolean isFixedTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    
}