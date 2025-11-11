package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MatchingPairDTO {
    private String prompt;
    private String answer;

    public MatchingPairDTO(String prompt, String answer) {
        this.prompt = prompt;
        this.answer = answer;
    }
}