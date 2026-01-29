package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestAnalyticsDTO {
    private int totalAttempts;  
    private int passedCount;    
    private int failedCount;   
    private int inReviewCount; 
    private double averageScore; 
}