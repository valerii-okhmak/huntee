package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import jakarta.persistence.EntityNotFoundException; // Додайте цей імпорт
import org.dreamteam.dto.ExperienceRequest;
import org.dreamteam.dto.ExperienceResponse;
import org.dreamteam.service.ProfileService;
import org.springframework.http.HttpStatus; // Додайте цей імпорт
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Додайте цей імпорт
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

    @GetMapping
    public List<ExperienceResponse> getExperiences(Authentication authentication) {
        String email = authentication.getName();
        return profileService.getExperiences(email);
    }

    @PostMapping
    public ExperienceResponse addExperience(Authentication authentication, @RequestBody ExperienceRequest request) {
        String email = authentication.getName();
        return profileService.addExperience(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        try {
            profileService.deleteExperience(email, id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/user_id")
    public List<ExperienceResponse> getExperiencesByUserId(@RequestParam Integer userId) {
        return profileService.getExperiencesByUserId(userId);
    }
}