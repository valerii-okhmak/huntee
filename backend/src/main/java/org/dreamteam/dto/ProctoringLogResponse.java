package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import org.dreamteam.Entity.ProctoringEventType;
import jakarta.validation.constraints.NotNull;

@Data
@Builder

public class ProctoringLogResponse {
    private Long id;
    private LocalDateTime timestamp;
    private ProctoringEventType eventType;
    private String description;  
}
