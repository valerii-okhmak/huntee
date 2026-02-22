package org.dreamteam.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ManualGradeRequest {
    private BigDecimal points;   
    private String comment;      
}