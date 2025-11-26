package org.dreamteam.dto;

import com.fasterxml.jackson.annotation.JsonProperty; 
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TextAnswerDTO {
    private String correctText;

    @JsonProperty("isCaseSensitive") 
    private boolean isCaseSensitive;

    public TextAnswerDTO(String correctText, boolean isCaseSensitive) {
        this.correctText = correctText;
        this.isCaseSensitive = isCaseSensitive;
    }
}