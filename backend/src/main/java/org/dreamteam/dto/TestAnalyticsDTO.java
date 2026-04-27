package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestAnalyticsDTO implements Serializable {
    private int totalAttempts;  
    private int passedCount;    
    private int failedCount;   
    private int inReviewCount; 
    private double averageScore; 
}