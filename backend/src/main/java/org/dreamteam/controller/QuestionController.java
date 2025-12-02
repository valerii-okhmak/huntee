package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.dreamteam.dto.QuestionCreateRequest;
import org.dreamteam.dto.QuestionResponse;
import org.dreamteam.dto.QuestionUpdateRequest;
import org.dreamteam.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Question Controller", description = "API для керування питаннями")
public class QuestionController {

    private final QuestionService questionService;

    @Operation(summary = "Створити та додати нове питання до тесту")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/tests/{testId}/questions")
    public ResponseEntity<?> createAndAddQuestionToTest(
            @PathVariable UUID testId,
            @RequestBody QuestionCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            questionService.createQuestionAndLinkToTest(testId, request, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "Отримати деталі одного питання")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<QuestionResponse> getQuestionDetails(
            @PathVariable UUID  questionId) {
        
        QuestionResponse response = questionService.getQuestionDetails(questionId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Оновити питання")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/questions/{questionId}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable UUID  questionId,
            @RequestBody QuestionUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            QuestionResponse response = questionService.updateQuestion(questionId, request, userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @Operation(summary = "Видалити питання з банку")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestionFromBank(
            @PathVariable UUID  questionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            questionService.deleteQuestion(questionId, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    
    @Operation(summary = "Відв'язати питання від тесту")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/tests/{testId}/questions/{questionId}")
    public ResponseEntity<?> unlinkQuestionFromTest(
            @PathVariable UUID testId,
            @PathVariable UUID questionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            questionService.unlinkQuestionFromTest(testId, questionId, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}