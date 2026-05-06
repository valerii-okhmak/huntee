package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Set;

import org.dreamteam.Entity.QuestionCategory;
import org.dreamteam.Entity.QuestionType;

@Data
@NoArgsConstructor
public class QuestionUpdateRequest {
    private String questionText;
    private QuestionType questionType;
    private String comment;
    private Double customWeight;
    private Double effectiveWeight;
    private Long levelId;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
    private Set<QuestionCategory> categories;
}