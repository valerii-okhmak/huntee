package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;
import org.dreamteam.dto.ActivateCodeRequest;
import org.dreamteam.dto.GenerateCodesRequest;
import org.dreamteam.service.TestAccessCodeService;
import org.dreamteam.service.TestAccessCodeService.AccessCodeInfoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class TestAccessCodeController {

    private final TestAccessCodeService accessCodeService;

    @PostMapping("/test/{testId}/generate")
    public ResponseEntity<List<AccessCodeInfoDTO>> generateCodes(
            @PathVariable UUID testId,
            @Valid @RequestBody GenerateCodesRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<AccessCodeInfoDTO> codes = accessCodeService.generateCodes(
                testId, 
                request.getTag(), 
                request.getCount(), 
                userDetails.getUsername()
        );
        return ResponseEntity.ok(codes);
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<AccessCodeInfoDTO>> getTestCodes(
            @PathVariable UUID testId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<AccessCodeInfoDTO> codes = accessCodeService.getTestCodes(testId, userDetails.getUsername());
        return ResponseEntity.ok(codes);
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activateCode(
            @Valid @RequestBody ActivateCodeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            UUID testId = accessCodeService.activateCode(request.getCode(), userDetails.getUsername());
            return ResponseEntity.ok(Map.of("testId", testId));
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}