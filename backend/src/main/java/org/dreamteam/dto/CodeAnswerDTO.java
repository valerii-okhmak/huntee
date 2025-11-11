package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CodeAnswerDTO {
    private String templateCode;
    private String testCases;

    public CodeAnswerDTO(String templateCode, String testCases) {
        this.templateCode = templateCode;
        this.testCases = testCases;
    }
}