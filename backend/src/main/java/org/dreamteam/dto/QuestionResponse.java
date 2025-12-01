package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;
import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long questionId;
    private String questionText;
    private String comment;
    private QuestionType questionType;
    private String authorEmail;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
}