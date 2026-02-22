package org.dreamteam.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiGeneratedQuestionDto {
    
    // Основні поля питання
    private String questionType; // "SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT", "MATCHING", "CODE"
    private String questionText;
    private String imageUrl;     
    private String comment;      
    private Double weight;       

    // --- Вкладені структури (відповідають твоїй базі) ---
    
    private List<AiChoiceOptionDto> choiceOptions;
    private AiTextAnswerDto textAnswer;
    private List<AiMatchingPairDto> matchingPairs;
    private AiCodeAnswerDto codeAnswer;

    // --- Внутрішні DTO ---

    @Data
    public static class AiChoiceOptionDto {
        private Integer optionId; // Завжди 0 або null від AI
        private String optionText;
        private String imageUrl;
        private boolean isCorrect;
    }

    @Data
    public static class AiTextAnswerDto {
        private String correctText;
        private boolean isCaseSensitive;
    }

    @Data
    public static class AiMatchingPairDto {
        private String prompt;
        private String answer;
    }

    @Data
    public static class AiCodeAnswerDto {
        private String templateCode;
        private List<AiTestCaseDto> testCases; 
        private String language;
        private String methodName;
    }

    @Data
    public static class AiTestCaseDto {
        private List<Object> args; 
        private String expected;   
    }
}