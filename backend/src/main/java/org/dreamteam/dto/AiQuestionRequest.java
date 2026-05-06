package org.dreamteam.dto; 

import lombok.Data;

@Data
public class AiQuestionRequest {
    private String topic;
    private int count;
    private String difficulty;
    private String questionType; 
    private String language;
    private String customInstructions;
    private boolean autoLevel;
}