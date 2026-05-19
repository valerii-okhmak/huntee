package org.dreamteam.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import dev.langchain4j.service.spring.AiService;
import org.dreamteam.dto.AiGeneratedQuestionsResponse;

@AiService(chatModel = "googleGeminiChatModel")
public interface AiTestGenerationService {

    @SystemMessage("""
        You are an expert technical interviewer and software engineer.
        Generate high-quality interview questions based on the requested parameters.
        
        CRITICAL OUTPUT RULES:
        1. Return ONLY a raw JSON object. Do not include markdown code blocks (like ```json).
        2. The root object must contain a "questions" array.
        3. Use the exact structure below. Fields not relevant to a specific type must be null.
        4. If 'autoLevel' is true, group questions logically by assigning a short, descriptive topic to "suggestedLevel" (e.g., "React Hooks", "Database Basics"). If false, leave it null.
        
        === EXAMPLES PER TYPE ===
        
        1. TYPE: SINGLE_CHOICE
        {
          "questionType": "SINGLE_CHOICE",
          "questionText": "What is the default value of int in Java?",
          "suggestedLevel": "Java Basics",
          "weight": 1.0,
          "choiceOptions": [
            { "optionText": "0", "isCorrect": true },
            { "optionText": "null", "isCorrect": false }
          ],
          "textAnswer": null, "matchingPairs": null, "codeAnswer": null
        }

        2. TYPE: CODE
        {
          "questionType": "CODE",
          "questionText": "Write a method 'sum' that adds two integers.",
          "suggestedLevel": "Algorithms",
          "weight": 1.0,
          "codeAnswer": {
             "language": "java",
             "methodName": "sum",
             "templateCode": "public class Solution {\\n    public int sum(int a, int b) {\\n        // TODO\\n        return 0;\\n    }\\n}",
             "testCases": [
                { "args": [1, 2], "expected": "3" }
             ]
          },
          "choiceOptions": null, "textAnswer": null, "matchingPairs": null
        }
    """)
    @UserMessage("""
        Generate EXACTLY {{count}} questions on topic: "{{topic}}".
        Difficulty level: {{difficulty}}.
        
        REQUIRED TYPE: {{type}}. 
        (If type is 'MIXED', generate a balanced mix of all types).
        
        Programming Language (if applicable): {{language}}.
        
        Should generate levels?: {{autoLevel}}
        
        User's custom instructions (strictly follow these if provided):
        "{{customInstructions}}"
    """)
    AiGeneratedQuestionsResponse generateQuestions(
            @V("topic") String topic,
            @V("count") int count,
            @V("difficulty") String difficulty,
            @V("type") String type,
            @V("language") String language,
            @V("customInstructions") String customInstructions,
            @V("autoLevel") boolean autoLevel
    );
}