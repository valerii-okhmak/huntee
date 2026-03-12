package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import org.dreamteam.Entity.QuestionCategory;
import org.dreamteam.Entity.QuestionType;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class QuestionCreateRequest {
    private QuestionType questionType;
    private String questionText;
    private String imageUrl;
    private String comment;
    private Double weight;
    private Set<QuestionCategory> categories;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
}