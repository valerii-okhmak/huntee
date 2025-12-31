package org.dreamteam.dto;

import lombok.Builder;
import lombok.Data;
import org.dreamteam.Entity.QuestionType;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestDetailResponse {
    
    private UUID testId;
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
    private String authorUsername;
    private Boolean isPrivate;  
    private List<QuestionSummary> questions;
    private Double maxScore;
    private Boolean isFixedQuestionOrder;
    private Boolean isFixedAnswerOrder;
    private Boolean isShowResult;
    

    @Data
    @Builder
    public static class QuestionSummary {
        private UUID questionId;
        private String questionText;
        private QuestionType type; // або questionType, як вам зручніше
        private Double weight;
        private Integer orderIndex;

        // === ТЕ, ЩО МИ БЕРЕМО З ВАШОГО TestAttemptReviewResponse ===
        
        // Список варіантів (для SINGLE/MULTI CHOICE)
        private List<ChoiceOptionDTO> options; 
        
        // Для редагування важливо знати, які варіанти правильні.
        // Можна передавати це окремим списком ID, як у вас:
        private List<Long> correctOptionIds; 
        
        // АБО краще додати поле isCorrect всередину ChoiceOptionDTO (див. нижче)

        // Поля для коду (якщо є питання з кодом)
        private String templateCode;
        private String language;
        private String testCases;
    }
}