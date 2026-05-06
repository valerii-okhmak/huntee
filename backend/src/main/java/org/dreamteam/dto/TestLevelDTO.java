package org.dreamteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.dreamteam.Entity.QuestionType;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TestLevelDTO {
    private UUID levelId;
    private String name;
    private Double orderIndex;
    private Double weight;
}