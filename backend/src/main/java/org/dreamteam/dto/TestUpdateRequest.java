package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.lang.Boolean;

@Data
@NoArgsConstructor
public class TestUpdateRequest {

    private String testName;
    private String sphere;
    private String level;
    private String city;
    private String vacancyDescription;
    private String responsibilities;
    private Boolean isFixedTime;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Integer durationMinutes;
    private Boolean isPrivate;
    private Boolean isFixedAnswerOrder;
    private Boolean isShowResult;
    private List<UUID> QuestionIds;
    private Boolean IsFixedQuestionOrder;

}