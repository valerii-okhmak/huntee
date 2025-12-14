package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class MyTestDTO {
    private UUID id;
    private String title;
    private String sphere;
    private String level;
    private String city;
    private OffsetDateTime startTime;
    private String status; 
    private int candidatesCount; 
}