package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.dreamteam.Entity.QuestionType;
import java.util.List;

@Data
@NoArgsConstructor
public class AnswerSubmissionRequest {

    private QuestionType questionType;

    // Для TEXT або CODE
    private String givenText;
    
    // Для SINGLE_CHOICE або MULTIPLE_CHOICE
    private List<Long> selectedOptionIds;
    
    // Для MATCHING
    private List<MatchingAnswerDTO> matchingAnswers;

    @Data
    @NoArgsConstructor
    public static class MatchingAnswerDTO {
        private Long promptPairId; // ID "лівої" частини
        private String selectedAnswerText; // Текст "правої" частини
    }
}