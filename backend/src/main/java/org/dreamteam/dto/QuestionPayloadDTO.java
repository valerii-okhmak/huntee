package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.dreamteam.Entity.QuestionType;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionPayloadDTO {
    
    private UUID id;
    private String questionText;
    private QuestionType questionType;
    private String comment;
    private Long levelId;
    private Double customWeight;
    private Double effectiveWeight;
    private Integer orderIndex;

    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private CodeAnswerDTO codeAnswer;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChoiceOptionDTO {
        private String optionText;
        private Boolean isCorrect;
        private Integer orderIndex;
        private String imageUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TextAnswerDTO {
        private String correctText;
        private Boolean isCaseSensitive; // або caseSensitive, перевір як в тебе в Entity
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeAnswerDTO {
        private String language;
        private String methodName;
        private String templateCode;
        private String testCases; // JSON рядок
    }
}