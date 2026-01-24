package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
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
    private BigDecimal totalMaxScore; 
    private OffsetDateTime date;
    private UUID attemptId;
}