package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestLevelDTO {
    private Long id; 
    private String name;
    private Double orderIndex;
    private Double weight;
    private Integer questionsLimit; 

    public TestLevelDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}