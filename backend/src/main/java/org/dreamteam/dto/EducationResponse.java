package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EducationResponse {
    private Long id;
    private String institution;
    private String specialities;
}
