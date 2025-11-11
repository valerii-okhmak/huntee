package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TextAnswerDTO {
    private String correctText;
    private boolean isCaseSensitive;

    public TextAnswerDTO(String correctText, boolean isCaseSensitive) {
        this.correctText = correctText;
        this.isCaseSensitive = isCaseSensitive;
    }
}