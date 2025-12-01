package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.dreamteam.Entity.QuestionType;
import java.util.List;

@Data
@NoArgsConstructor
public class QuestionCreateRequest {
    private QuestionType questionType;
    private String questionText;
    private String comment;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
}