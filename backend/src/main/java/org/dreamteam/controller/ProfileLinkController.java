package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException; 
import org.dreamteam.dto.ProfileLinkRequest;
import org.dreamteam.dto.ProfileLinkResponse;
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
@RequestMapping("/api/profile/links")
@RequiredArgsConstructor
public class ProfileLinkController {
    private final ProfileService profileService;

    @GetMapping
    public List<ProfileLinkResponse> getLinks(Authentication authentication) {
        String email = authentication.getName();
        return profileService.getLinks(email);
    }

    @PostMapping
    public ProfileLinkResponse addLink(Authentication authentication, @RequestBody ProfileLinkRequest request) {
        String email = authentication.getName();
        return profileService.addLink(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLink(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        try {
            profileService.deleteLink(email, id); 
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/user_id")
    public List<ProfileLinkResponse> getLinksByUserId(@RequestParam UUID  userId) {
        return profileService.getLinksByUserId(userId);
    }
}