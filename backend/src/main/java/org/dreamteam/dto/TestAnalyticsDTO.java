package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestAnalyticsDTO {
    private int totalRegistered;
    private int totalAttempts; 
    private int totalCompleted; 
    private int passedCount;    
    private double averageScore;
}