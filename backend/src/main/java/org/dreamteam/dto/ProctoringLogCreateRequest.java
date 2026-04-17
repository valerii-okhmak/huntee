package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import org.dreamteam.Entity.ProctoringEventType;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class ProctoringLogCreateRequest {

    @NotNull(message = "Час події не може бути порожнім")
    private LocalDateTime timestamp;

    @NotNull(message = "Тип події обов'язковий")
    private ProctoringEventType eventType;

    private String description;
}
