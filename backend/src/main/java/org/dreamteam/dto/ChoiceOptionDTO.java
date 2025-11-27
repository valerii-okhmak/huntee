package org.dreamteam.dto;

import com.fasterxml.jackson.annotation.JsonProperty; 
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChoiceOptionDTO {
    private String optionText;

    @JsonProperty("isCorrect") 
    private boolean isCorrect;

    public ChoiceOptionDTO(String optionText, boolean isCorrect) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
    }
}