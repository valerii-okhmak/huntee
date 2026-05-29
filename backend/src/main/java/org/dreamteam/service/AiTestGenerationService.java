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
        3. STRICT TYPE ENFORCEMENT: The "questionType" field MUST be EXACTLY one of: "SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT", "CODE", "MATCHING". NEVER invent new types.
        4. Use the exact structure below. Fields not relevant to a specific type must be null.
        
        === AUTO-LEVELING & PROGRESSION RULES ===
        If 'autoLevel' is true, you MUST STRICTLY divide the questions into EXACTLY 3 progressive levels. You cannot put all questions into one level!
        - Level 1 (Easy): Assign "suggestedLevel": "1 - Basic" (or similar basic topic). Set "weight": 1.0.
        - Level 2 (Medium): Assign "suggestedLevel": "2 - Intermediate" (or similar medium topic). Set "weight": 2.0.
        - Level 3 (Hard): Assign "suggestedLevel": "3 - Advanced" (or similar advanced topic). Set "weight": 3.0 or higher.
        Distribute the requested total number of questions logically across these 3 levels (e.g., if count is 10, generate 4 Easy, 4 Medium, 2 Hard).
        If 'autoLevel' is false, leave "suggestedLevel" as null and use standard weights.
        
        === EXAMPLES PER TYPE ===
        
        1. TYPE: SINGLE_CHOICE (Easy Example)
        {
          "questionType": "SINGLE_CHOICE",
          "questionText": "What is the default value of int in Java?",
          "suggestedLevel": "1 - Basic Concepts",
          "weight": 1.0,
          "choiceOptions": [
            { "optionText": "0", "isCorrect": true },
            { "optionText": "null", "isCorrect": false }
          ],
          "textAnswer": null, "matchingPairs": null, "codeAnswer": null
        }

        2. TYPE: MULTIPLE_CHOICE (Medium Example)
        {
          "questionType": "MULTIPLE_CHOICE",
          "questionText": "Which of these are valid synchronization techniques?",
          "suggestedLevel": "2 - Multithreading",
          "weight": 2.0,
          "choiceOptions": [
            { "optionText": "synchronized keyword", "isCorrect": true },
            { "optionText": "volatile keyword", "isCorrect": true },
            { "optionText": "hidden keyword", "isCorrect": false }
          ],
          "textAnswer": null, "matchingPairs": null, "codeAnswer": null
        }

        3. TYPE: CODE (Hard Example)
        {
          "questionType": "CODE",
          "questionText": "Implement a thread-safe Singleton using double-checked locking.",
          "suggestedLevel": "3 - Advanced Patterns",
          "weight": 4.0,
          "codeAnswer": {
             "language": "java",
             "methodName": "getInstance",
             "templateCode": "public class Singleton {\\n    // TODO\\n}",
             "testCases": [
                { "args": [], "expected": "SingletonInstance" }
             ]
          },
          "choiceOptions": null, "textAnswer": null, "matchingPairs": null
        }
    """)
    @UserMessage("""
        Generate EXACTLY {{count}} questions on topic: "{{topic}}".
        Target Candidate Difficulty: {{difficulty}}.
        
        REQUIRED TYPE: {{type}}. 
        (If type is 'MIXED', generate a balanced mix of strictly allowed types).
        
        Programming Language (if applicable): {{language}}.
        
        Should generate levels with progressive difficulty?: {{autoLevel}}
        
        User's custom instructions:
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