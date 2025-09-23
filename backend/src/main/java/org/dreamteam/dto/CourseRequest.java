package org.dreamteam.dto;

import lombok.Data;

@Data
public class CourseRequest {
    private String course_name;
    private String certificateUrl;
    private String description;
}