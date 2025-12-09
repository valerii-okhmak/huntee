package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CodeAnswerDTO {
    private String templateCode;
    private String testCases;
    private String language;
    private String methodName;

    public CodeAnswerDTO(String templateCode, String testCases, String language, String methodName) {
        this.templateCode = templateCode;
        this.testCases = testCases;
        this.language = language;
        this.methodName = methodName;
    }
}