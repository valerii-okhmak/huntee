package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import org.dreamteam.Entity.QuestionType;

@Data
@Builder
public class QuestionImportDTO {
    private String questionText;
    private QuestionType questionType; 
    private Double points;
    private String comment;
    private List<ChoiceOptionImportDTO> choiceOptions;
    private TextAnswerImportDTO textAnswer;
}
