package org.dreamteam.controller;


import lombok.RequiredArgsConstructor;

import org.dreamteam.Entity.Profile;
import org.dreamteam.dto.ProfileRequest;
import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.security.CustomUserDetails;
import org.dreamteam.security.CustomUserDetailsService;
import org.dreamteam.service.JwtService;


import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.Parameter;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final JwtService jwtService;
    private final CustomUserDetailsService userService;

    @GetMapping("/me")
    public ProfileResponse getMyProfile(
        @Parameter(description = "JWT token", required = true, example = "eyJ...")
        @RequestParam("token") String token 
    ) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtService.extractUsername(token);

        CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByUsername(email);

        Profile profile = userDetails.getProfile();
        if (profile == null) {
            throw new IllegalStateException("Profile is not initialized for the current user");
        }
        
        return ProfileResponse.builder()
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profileImage(profile.getProfileImageUrl())
                .build();
    }


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
        profile.setProfileImageUrl(profileRequest.getProfileImageUrl());
    
        // Якщо використовуєте JPA, то збережіть оновлення у базу:
        userService.saveProfile(profile); // реалізуй цей метод у CustomUserDetailsService
    
        return ProfileResponse.builder()
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profileImage(profile.getProfileImageUrl())
                .build();
    }
}
