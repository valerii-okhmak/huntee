package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import org.dreamteam.Entity.QuestionCategory;
import org.dreamteam.Entity.QuestionType;

import java.util.List;
import java.util.UUID;
import java.util.Set;

@Data
@Builder
public class QuestionResponse {
    private UUID questionId;
    private String questionText;
    private String comment;
    private QuestionType questionType;
    private Double customWeight;
    private Double effectiveWeight;
    private Long levelId;
    private String authorEmail;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
    private Set<QuestionCategory> categories;
}