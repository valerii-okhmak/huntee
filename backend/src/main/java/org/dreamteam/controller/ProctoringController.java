package org.dreamteam.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.dreamteam.service.ProctoringService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import org.dreamteam.dto.ProctoringLogCreateRequest;
import org.dreamteam.dto.ProctoringLogResponse;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
@Tag(name = "Proctoring Controller", description = "API для моніторингу активності кандидата")

public class ProctoringController {
    private final ProctoringService proctoringService;
    @Operation(summary = "Зберегти логи прокторингу", description = "Приймає масив подій (перемикання вкладок, копіювання) від браузера кандидата.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{attemptId}/logs")
    public ResponseEntity<Void> saveProctoringLogs(@PathVariable UUID attemptId, @RequestBody List<ProctoringLogCreateRequest> logs) {
        proctoringService.saveLogs(attemptId, logs);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Отримати логи спроби", description = "Повертає всю історію підозрілої активності кандидата для рекрутера.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{attemptId}/logs")
    public ResponseEntity<List<ProctoringLogResponse>> getLogs(
            @PathVariable UUID attemptId) {
        
        List<ProctoringLogResponse> response = proctoringService.getLogsForAttempt(attemptId);
        return ResponseEntity.ok(response);
    }

    
}
