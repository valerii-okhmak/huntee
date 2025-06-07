package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.dreamteam.Entity.Experience;
import org.dreamteam.dto.ExperienceRequest;
import org.dreamteam.dto.ExperienceResponse;
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
@RequestMapping("/api/profile/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    @GetMapping
    public List<ExperienceResponse> getExperiences(@RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.getExperiences(email);
    }

    @PostMapping
    public ExperienceResponse addExperience(@RequestParam("token") String token, @RequestBody ExperienceRequest request) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.addExperience(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@RequestParam("token") String token, @PathVariable Long id) throws AccessDeniedException {
        profileService.deleteExperience(token, id);
        return ResponseEntity.noContent().build();
    }

    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}