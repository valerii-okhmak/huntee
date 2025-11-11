package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChoiceOptionDTO {
    private String optionText;
    private boolean isCorrect;

    public ChoiceOptionDTO(String optionText, boolean isCorrect) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
    }
}