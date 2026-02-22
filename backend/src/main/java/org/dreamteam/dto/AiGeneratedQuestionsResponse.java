package org.dreamteam.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiGeneratedQuestionsResponse {
    private List<AiGeneratedQuestionDto> questions;
}