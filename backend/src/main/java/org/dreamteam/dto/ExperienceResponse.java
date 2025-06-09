package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExperienceResponse {
    private Long id;
    private String projectName;
    private String projectUrl;
    private String description;
}
