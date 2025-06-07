package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.dreamteam.Entity.Education;
import org.dreamteam.dto.EducationRequest;
import org.dreamteam.dto.EducationResponse;
import org.dreamteam.service.JwtService;
import org.dreamteam.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/education")
@RequiredArgsConstructor
public class EducationController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    @GetMapping
    public List<EducationResponse> getEducation(@RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.getEducations(email);
    }

    @PostMapping
    public EducationResponse addEducation(@RequestParam("token") String token, @RequestBody EducationRequest request) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.addEducation(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@RequestParam("token") String token, @PathVariable Long id) throws AccessDeniedException {
        profileService.deleteEducation(token , id);
        return ResponseEntity.noContent().build();
    }

    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}
