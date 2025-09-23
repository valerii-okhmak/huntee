package org.dreamteam.controller;


import lombok.RequiredArgsConstructor;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;

import org.dreamteam.Entity.Profile;
import org.dreamteam.dto.CourseResponse;
import org.dreamteam.dto.EducationResponse;
import org.dreamteam.dto.ExperienceResponse;
import org.dreamteam.dto.ProfileLinkResponse;
import org.dreamteam.dto.ProfileRequest;
import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.security.CustomUserDetails;
import org.dreamteam.security.CustomUserDetailsService;
import org.dreamteam.service.JwtService;
import org.dreamteam.service.ProfileService;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private static final String UPLOAD_DIR = "backend/uploads/avatars/";

    private final JwtService jwtService;
    private final CustomUserDetailsService userService;
    private final ProfileService profileService;



    @PostMapping
    public ProfileResponse updateProfile(
        @Parameter(description = "JWT token", required = true, example = "Bearer eyJ...")
        @RequestParam("token") String token,
        @RequestBody ProfileRequest profileRequest
    ) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    
        String email = jwtService.extractUsername(token);
        CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByUsername(email);
        Profile profile = userDetails.getProfile();
    
        if (profile == null) {
            profile = new Profile();
            userDetails.setProfile(profile);
        }
        

        profile.setFirstName(profileRequest.getFirstName());
        profile.setLastName(profileRequest.getLastName());
        profile.setBirthDate(profileRequest.getBirthDate());
        profile.setProfileImageUrl(profileRequest.getProfileImageUrl());
        profile.setAbout(profileRequest.getAbout());
    
        userService.saveProfile(profile); 
    
        return ProfileResponse.builder()
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profileImage(profile.getProfileImageUrl())
                .about(profile.getAbout())
                .build();
    }


    @GetMapping("/me")
    public ProfileResponse getMyProfile(@RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.getProfileResponseByEmail(email);
    }

    @PatchMapping("/first-name")
    public ProfileResponse updateFirstName(@RequestParam("token") String token, @RequestBody String firstName) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.updateFirstName(email, firstName);
    }


    @PatchMapping("/last-name")
    public ProfileResponse updateLastName(@RequestParam("token") String token, @RequestBody String lastName) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.updateLastName(email, lastName);
    }

    @PatchMapping("/birth-date")
    public ProfileResponse updateBirthDate(@RequestParam("token") String token, @RequestBody String birthDate) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.updateBirthDate(email, birthDate);
    }


    @PatchMapping("/profile-image")
    public ProfileResponse updateProfileImage(@RequestParam("token") String token, @RequestBody String imageUrl) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.updateProfileImage(email, imageUrl);
    }

    @PatchMapping("/about")
    public ProfileResponse updateAbout(@RequestParam("token") String token, @RequestBody String about) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.updateAbout(email, about);
    }

    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
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
    @Parameter(name = "token",  required = true)
    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
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

            // Визначаємо MIME type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // fallback
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }












}
