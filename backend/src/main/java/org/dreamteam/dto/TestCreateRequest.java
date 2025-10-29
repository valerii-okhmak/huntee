package org.dreamteam.dto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class TestCreateRequest {
    private String testName;
    private String description;  
}
