package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;
import org.dreamteam.dto.AnswerSubmissionRequest;
import org.dreamteam.dto.CodeRunResponse;
import org.dreamteam.dto.TestAttemptReviewResponse;
import org.dreamteam.dto.TestResultResponse;
import org.dreamteam.dto.TestTakeResponse;
import org.dreamteam.service.TestAttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.dreamteam.service.CodeExecutionService;
import org.dreamteam.Entity.Question;
import org.dreamteam.repository.QuestionRepository;
import org.dreamteam.dto.CodeRunResponse;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Test Attempt Controller", description = "API для проходження тестів кандидатами")
public class TestAttemptController {

    private final TestAttemptService testAttemptService;
    private final CodeExecutionService codeExecutionService;
    private final QuestionRepository questionRepository;

    @Operation(summary = "Запустити код (перевірка)", description = "Компілює код користувача і повертає результат проходження тестів.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/attempts/{attemptId}/questions/{questionId}/run")
    public ResponseEntity<?> runCode(
            @PathVariable Long attemptId,
            @PathVariable Long questionId,
            @RequestBody String userCode,
            @AuthenticationPrincipal UserDetails userDetails) {
                
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        
        if (question.getCodeAnswer() == null) {
            return ResponseEntity.badRequest().body("Not a code question");
        }

        CodeRunResponse result = codeExecutionService.runCode(userCode, question.getCodeAnswer());
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Почати проходження тесту",
               description = "Створює нову 'спробу' для тесту {testId} і повертає список питань.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/tests/{testId}/start")
    public ResponseEntity<?> startTest(
            @PathVariable Long testId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            TestTakeResponse response = testAttemptService.startTest(testId, userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Надіслати відповідь на питання",
               description = "Зберігає відповідь кандидата на питання {questionId} в рамках спроби {attemptId}.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/attempts/{attemptId}/questions/{questionId}/answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long attemptId,
            @PathVariable Long questionId,
            @RequestBody AnswerSubmissionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            testAttemptService.submitAnswer(attemptId, questionId, request, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Завершити тест та отримати результат",
               description = "Завершує спробу {attemptId}, проводить оцінювання та повертає результат.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/attempts/{attemptId}/finish")
    public ResponseEntity<?> finishTest(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            TestResultResponse response = testAttemptService.finishTest(attemptId, userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Отримати детальний огляд результатів тесту",
               description = "Повертає повну історію спроби: питання, відповіді користувача, правильні відповіді та коментарі.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/attempts/{attemptId}/review")
    public ResponseEntity<TestAttemptReviewResponse> reviewAttempt(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal UserDetails userDetails) {

        TestAttemptReviewResponse review = testAttemptService.getAttemptReview(attemptId, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }
}