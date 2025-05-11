package org.dreamteam.controller;


import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.dreamteam.Entity.Profile;
import org.dreamteam.dto.ProfileRequest;
import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.security.CustomUserDetails;
import org.dreamteam.security.CustomUserDetailsService;
import org.dreamteam.service.JwtService;
import org.dreamteam.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.Parameter;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

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
        profile.setProfileImageUrl(profileRequest.getProfileImageUrl());
        profile.setAbout(profileRequest.getAbout());
    
        // Якщо використовуєте JPA, то збережіть оновлення у базу:
        userService.saveProfile(profile); // реалізуй цей метод у CustomUserDetailsService
    
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
}
