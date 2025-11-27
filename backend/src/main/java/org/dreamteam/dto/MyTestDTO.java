package org.dreamteam.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MyTestDTO {
    private Long id;
    private String title;
    private String status; 
    private int candidatesCount; 
}