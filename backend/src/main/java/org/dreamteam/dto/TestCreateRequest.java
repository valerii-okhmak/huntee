package org.dreamteam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
public class TestCreateRequest {
    
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
    private Boolean isFixedQuestionOrder;
    private Boolean isFixedAnswerOrder;
    private Boolean isShowResult;
    private List<UUID> questionIds;
}