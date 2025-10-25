package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import jakarta.persistence.EntityNotFoundException; 
import org.dreamteam.dto.EducationRequest;
import org.dreamteam.dto.EducationResponse;
import org.dreamteam.service.ProfileService;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping
    public List<EducationResponse> getEducation(Authentication authentication) {
        String email = authentication.getName();
        return profileService.getEducations(email);
    }

    @PostMapping
    public EducationResponse addEducation(Authentication authentication, @RequestBody EducationRequest request) {
        String email = authentication.getName();
        return profileService.addEducation(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        try {
            profileService.deleteEducation(email, id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/user_id")
    public List<EducationResponse> getEducationsByUserId(@RequestParam Integer userId) {
        return profileService.getEducationsByUserId(userId);
    }
}