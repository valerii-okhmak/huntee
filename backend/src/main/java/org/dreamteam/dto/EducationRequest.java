package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EducationRequest {
    private String institution;
    private String specialities;
}
