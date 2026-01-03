package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import org.dreamteam.Entity.QuestionType;

@Data
@NoArgsConstructor
public class QuestionUpdateRequest {
    private String questionText;
    private QuestionType questionType;
    private String comment;
    private Double weight;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
}