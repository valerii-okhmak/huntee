package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.dreamteam.dto.CandidateDTO;
import org.dreamteam.dto.ExportRequestDTO;
import org.dreamteam.dto.MyTestDTO;
import org.dreamteam.dto.TestAdvancedAnalyticsDTO;
import org.dreamteam.dto.TestAnalyticsDTO;
import org.dreamteam.dto.TestCreateRequest;
import org.dreamteam.dto.TestDetailResponse;
import org.dreamteam.dto.TestSummaryResponse;
import org.dreamteam.dto.TestUpdateRequest;
import org.dreamteam.service.TestService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
@Tag(name = "Test Controller", description = "API для керування тестами (CRUD)")

public class TestController {
    private final TestService testService;
    @Operation(summary = "Створити новий тест")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тест успішно створено (повертає деталі тесту)"),
        @ApiResponse(responseCode = "400", description = "Некоректний запит (напр., відсутня назва)"),
        @ApiResponse(responseCode = "401", description = "Неавторизований (потрібен токен)")
    })
    @SecurityRequirement(name = "bearerAuth")
    
    @PostMapping
    public ResponseEntity<TestDetailResponse> createTest(
        @RequestBody TestCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {
            String authorEmail = userDetails.getUsername();
            TestDetailResponse createdTest = testService.createTest(request, authorEmail);
            return ResponseEntity.ok(createdTest);       
    }

    @Operation(summary = "Отримати список всіх тестів")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список тестів успішно отримано"),
        @ApiResponse(responseCode = "401", description = "Неавторизований")
    })
    @SecurityRequirement(name = "bearerAuth")

    @GetMapping
    public ResponseEntity <List<TestSummaryResponse>> getAllTests() {
        List<TestSummaryResponse> tests = testService.getAllTests();
        return ResponseEntity.ok(tests);
    }

    @Operation(summary = "Отримати один тест за ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тест знайдено"),
        @ApiResponse(responseCode = "401", description = "Неавторизований"),
        @ApiResponse(responseCode = "404", description = "Тест з таким ID не знайдено")
    })
    @SecurityRequirement(name = "bearerAuth")

    @GetMapping("/{id}")
    public ResponseEntity<TestDetailResponse> getTestById(
        @Parameter(description = "ID тесту, який потрібно знайти")
        @PathVariable UUID id) {
            TestDetailResponse test = testService.getTestById(id);
            return ResponseEntity.ok(test);
        }
    
    @Operation(summary = "Оновити тест")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тест успішно оновлено (повертає нові деталі)"),
        @ApiResponse(responseCode = "401", description = "Неавторизований"),
        @ApiResponse(responseCode = "403", description = "Доступ заборонено (ви не автор)"),
        @ApiResponse(responseCode = "404", description = "Тест з таким ID не знайдено")
    })

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<TestDetailResponse> updateTest(
        @Parameter(description = "ID тесту, який потрібно оновити")
            @PathVariable UUID id,
            @RequestBody TestUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
                String userEmail = userDetails.getUsername();
                TestDetailResponse updatedTest = testService.updateTest(id, request, userEmail);
                return ResponseEntity.ok(updatedTest);
            }
    
    @Operation(summary = "Видалити тест")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Тест успішно видалено (без тіла відповіді)"),
        @ApiResponse(responseCode = "401", description = "Неавторизований"),
        @ApiResponse(responseCode = "403", description = "Доступ заборонено (ви не автор)"),
        @ApiResponse(responseCode = "404", description = "Тест з таким ID не знайдено")
    })
    @SecurityRequirement(name = "bearerAuth") 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(
            @Parameter(description = "ID тесту, який потрібно видалити")
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userEmail = userDetails.getUsername();
        testService.deleteTest(id, userEmail);
        
        return ResponseEntity.noContent().build(); 
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Void> registerForTest(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        testService.registerForTest(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/created") 
    public ResponseEntity<List<MyTestDTO>> getCreatedTests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getCreatedTests(userDetails.getUsername()));
    }

    @GetMapping("/my") 
    public ResponseEntity<List<MyTestDTO>> getMyTests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getMyCandidateTests(userDetails.getUsername()));
    }

    @Operation(summary = "Вкладка 'Зареєстровані'")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/candidates")
    public ResponseEntity<List<CandidateDTO>> getRegisteredCandidates(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getRegisteredCandidates(id, userDetails.getUsername()));
    }

    @Operation(summary = "Вкладка 'Результати'")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/results")
    public ResponseEntity<List<CandidateDTO>> getTestResults(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getTestResults(id, userDetails.getUsername()));
    }

    @Operation(summary = "Вкладка 'Аналітика'")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/analytics")
    public ResponseEntity<TestAnalyticsDTO> getTestAnalytics(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getTestAnalytics(id, userDetails.getUsername()));
    }

    @Operation(summary = "Експортувати результати тесту (Excel/PDF)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Файл успішно згенеровано"),
        @ApiResponse(responseCode = "403", description = "Доступ заборонено (ви не автор тесту)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{testId}/export")
    public ResponseEntity<byte[]> exportResults(
            @PathVariable UUID testId,
            @RequestBody ExportRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        
        byte[] fileContent = testService.exportTestResults(testId, request, userDetails.getUsername());
        
        boolean isPdf = "PDF".equalsIgnoreCase(request.getFormat());
        String extension = isPdf ? ".pdf" : ".xlsx";
        String fileName = "results_" + testId + extension;
        
        MediaType mediaType = isPdf 
                ? MediaType.APPLICATION_PDF 
                : MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(mediaType)
                .body(fileContent);
    }

    @GetMapping("/{testId}/analytics/advanced")
    public ResponseEntity<TestAdvancedAnalyticsDTO> getAdvancedAnalytics(
            @PathVariable UUID testId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(testService.getAdvancedAnalytics(testId, userDetails.getUsername()));
    }
}



