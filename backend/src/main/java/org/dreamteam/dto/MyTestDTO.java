package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MyTestDTO {
    private UUID id;
    private String title;
    private String sphere;
    private String level;
    private String city;
    private LocalDateTime startTime;
    private String status; 
    private int candidatesCount; 
}