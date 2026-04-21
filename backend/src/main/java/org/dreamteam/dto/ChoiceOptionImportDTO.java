package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import org.dreamteam.Entity.QuestionType;

@Data
@Builder
public class ChoiceOptionImportDTO {
    private String optionText;
    private Boolean isCorrect;
    private Integer orderIndex;
}
