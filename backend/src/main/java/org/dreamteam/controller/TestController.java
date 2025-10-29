package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;

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

import java.util.List;

import com.nimbusds.oauth2.sdk.Response;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
@Tag(name = "Test Controller", description = "API для керування тестами (CRUD)")

public class TestController {
    private final TestService testService;
    @Operation(summary = "Створити новий тест", description = "Створює 'обкладинку' тесту.")
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

    @Operation(summary = "Отримати список всіх тестів", description = "Повертає список всіх тестів з короткою інформацією.")
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

    @Operation(summary = "Отримати один тест за ID", description = "Повертає повну інформацію про тест, включаючи список його питань.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тест знайдено"),
        @ApiResponse(responseCode = "401", description = "Неавторизований"),
        @ApiResponse(responseCode = "404", description = "Тест з таким ID не знайдено")
    })
    @SecurityRequirement(name = "bearerAuth")

    @GetMapping("/{id}")
    public ResponseEntity<TestDetailResponse> getTestById(
        @Parameter(description = "ID тесту, який потрібно знайти")
        @PathVariable Long id) {
            TestDetailResponse test = testService.getTestById(id);
            return ResponseEntity.ok(test);
        }
    
    @Operation(summary = "Оновити тест", description = "Оновлює назву або опис тесту. Доступно тільки автору тесту.")
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
            @PathVariable Long id,
            @RequestBody TestUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
                String userEmail = userDetails.getUsername();
                TestDetailResponse updatedTest = testService.updateTest(id, request, userEmail);
                return ResponseEntity.ok(updatedTest);
            }
    
    @Operation(summary = "Видалити тест", description = "Видаляє тест та всі пов'язані з ним питання. Доступно тільки автору тесту.")
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
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userEmail = userDetails.getUsername();
        testService.deleteTest(id, userEmail);
        
        return ResponseEntity.noContent().build(); 
    }

}

