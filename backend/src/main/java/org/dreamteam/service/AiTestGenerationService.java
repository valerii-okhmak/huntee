package org.dreamteam.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import dev.langchain4j.service.spring.AiService;
import org.dreamteam.dto.AiGeneratedQuestionsResponse;

@AiService(chatModel = "googleGeminiChatModel")
public interface AiTestGenerationService {

    @SystemMessage("""
        You are an expert technical interviewer.
        Generate interview questions based on the requested parameters.
        
        CRITICAL OUTPUT RULES:
        1. Return ONLY a raw JSON object. No markdown formatting (```json).
        2. The root object must contain a "questions" array.
        3. Use the exact structure below. Fields not relevant to a specific type must be null.
        
        === EXAMPLES PER TYPE ===
        
        1. TYPE: SINGLE_CHOICE (One correct option)
        {
          "questionType": "SINGLE_CHOICE",
          "questionText": "What is the default value of int in Java?",
          "weight": 1.0,
          "choiceOptions": [
            { "optionText": "0", "isCorrect": true },
            { "optionText": "null", "isCorrect": false },
            { "optionText": "1", "isCorrect": false }
          ],
          "textAnswer": null, "matchingPairs": null, "codeAnswer": null
        }

        2. TYPE: MULTIPLE_CHOICE (Multiple correct options)
        {
          "questionType": "MULTIPLE_CHOICE",
          "questionText": "Which are Java access modifiers?",
          "weight": 2.0,
          "choiceOptions": [
            { "optionText": "private", "isCorrect": true },
            { "optionText": "protected", "isCorrect": true },
            { "optionText": "external", "isCorrect": false }
          ],
          "textAnswer": null, "matchingPairs": null, "codeAnswer": null
        }

        3. TYPE: TEXT (Exact text match)
        {
          "questionType": "TEXT",
          "questionText": "What keyword is used to inherit a class?",
          "weight": 1.5,
          "textAnswer": {
            "correctText": "extends",
            "isCaseSensitive": false
          },
          "choiceOptions": null, "matchingPairs": null, "codeAnswer": null
        }

        4. TYPE: CODE (Programming task with test cases)
        {
          "questionType": "CODE",
          "questionText": "Write a method 'sum' that adds two integers.",
          "weight": 3.0,
          "codeAnswer": {
             "language": "java",
             "methodName": "sum",
             "templateCode": "public class Solution {\\n    public int sum(int a, int b) {\\n        // TODO\\n        return 0;\\n    }\\n}",
             "testCases": [
                { "args": [1, 2], "expected": "3" },
                { "args": [-5, 5], "expected": "0" }
             ]
          },
          "choiceOptions": null, "textAnswer": null, "matchingPairs": null
        }
    """)
    @UserMessage("""
        Generate {{count}} questions on topic: "{{topic}}".
        Difficulty: {{difficulty}}.
        
        REQUIRED TYPE: {{type}}. 
        (If type is 'MIXED', generate a balanced mix of all types).
        
        Language: {{language}}.
    """)
    AiGeneratedQuestionsResponse generateQuestions(
            @V("topic") String topic,
            @V("count") int count,
            @V("difficulty") String difficulty,
            @V("type") String type,
            @V("language") String language
    );
}