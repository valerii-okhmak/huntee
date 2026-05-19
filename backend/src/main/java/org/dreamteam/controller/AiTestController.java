package org.dreamteam.controller; 

import lombok.RequiredArgsConstructor;
import org.dreamteam.dto.AiGeneratedQuestionDto;
import org.dreamteam.dto.AiGeneratedQuestionsResponse;
import org.dreamteam.dto.AiQuestionRequest;
import org.dreamteam.service.AiTestGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/tests")
@RequiredArgsConstructor
public class AiTestController {

    private final AiTestGenerationService aiService;

    @PostMapping("/generate")
    public ResponseEntity<List<AiGeneratedQuestionDto>> generate(
            @RequestBody AiQuestionRequest request
    ) {
        int count = Math.min(request.getCount(), 10); 

        AiGeneratedQuestionsResponse response = aiService.generateQuestions(
                request.getTopic(),
                count,
                request.getDifficulty(),
                request.getQuestionType(),
                request.getLanguage(), 
                request.getCustomInstructions(), 
                request.isAutoLevel()
        );

        return ResponseEntity.ok(response.getQuestions());
    }
}