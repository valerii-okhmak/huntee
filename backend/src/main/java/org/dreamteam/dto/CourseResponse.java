package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String course_name;
    private String certificateUrl;
    private String description;
}
