package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;

import org.dreamteam.Entity.QuestionType;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class QuestionResponse {
    private UUID questionId;
    private String questionText;
    private QuestionType questionType;
    private String authorEmail;
    private List<ChoiceOptionDTO> choiceOptions;
    private TextAnswerDTO textAnswer;
    private List<MatchingPairDTO> matchingPairs;
    private CodeAnswerDTO codeAnswer;
}