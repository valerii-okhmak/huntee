package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CandidateDTO {
    private UUID userId; 
    private String fullName;
    private String email;
    private String profileImageUrl;
    private String status; 
    private BigDecimal score; 
    private LocalDateTime date;
}