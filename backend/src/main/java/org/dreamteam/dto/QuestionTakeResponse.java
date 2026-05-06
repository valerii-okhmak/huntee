package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import org.dreamteam.Entity.QuestionType;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class QuestionTakeResponse {
    private UUID questionId;
    private String questionText;
    private QuestionType questionType;
    private String comment;
    private Long levelId;
    private Double customWeight;
    private Double effectiveWeight;
    private List<ChoiceOptionTakeDTO> choiceOptions;
    private List<MatchingPromptDTO> matchingPrompts;
    
    private String templateCode;
    private String codeLanguage; 
    
    @Data
    @Builder
    public static class ChoiceOptionTakeDTO {
        private Long optionId;
        private String optionText;
    }

    @Data
    @Builder
    public static class MatchingPromptDTO {
        private Long pairId;
        private String prompt;
    }
}