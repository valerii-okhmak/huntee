package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;

import java.nio.file.Files;
import java.util.Map;

import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.service.ProfileService;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private static final String UPLOAD_DIR = "backend/uploads/avatars/";
    private final ProfileService profileService;

    @GetMapping("/me")
    public ProfileResponse getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return profileService.getProfileResponseByEmail(email);
    }

    @PatchMapping("/first-name")
    public ProfileResponse updateFirstName(Authentication authentication, @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        return profileService.updateFirstName(email, payload.get("firstName"));
    }

    @PatchMapping("/last-name")
    public ProfileResponse updateLastName(Authentication authentication, @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        return profileService.updateLastName(email, payload.get("lastName"));
    }

    @PatchMapping("/birth-date")
    public ProfileResponse updateBirthDate(Authentication authentication, @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        return profileService.updateBirthDate(email, payload.get("birthDate"));
    }

    @PatchMapping("/profile-image")
    public ProfileResponse updateProfileImage(Authentication authentication, @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        return profileService.updateProfileImage(email, payload.get("imageUrl"));
    }

    @PatchMapping("/about")
    public ProfileResponse updateAbout(Authentication authentication, @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        return profileService.updateAbout(email, payload.get("about"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Integer userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    @Operation(summary = "Завантажити аватар профілю")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Файл успішно завантажено"),
            @ApiResponse(responseCode = "400", description = "Невірний запит"),
            @ApiResponse(responseCode = "500", description = "Помилка сервера")
    })
    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) { 
        String email = authentication.getName();
        ProfileResponse response = profileService.saveProfileImage(email, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/avatar/{fileName:.+}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}