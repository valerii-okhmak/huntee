package org.dreamteam.controller;


import lombok.RequiredArgsConstructor;

import org.dreamteam.Entity.Profile;
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
        // Перевірка формату токену (якщо він починається з 'Bearer ', видаляємо це слово)
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }


        // Витягуємо email з токену
        String email = jwtService.extractUsername(token);

        // Завантажуємо користувача по email
        CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByUsername(email);

        // Перевіряємо профіль користувача
        Profile profile = userDetails.getProfile();
        if (profile == null) {
            throw new IllegalStateException("Profile is not initialized for the current user");
        }

        // Повертаємо відповідь
        return ProfileResponse.builder()
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profileImage(profile.getProfileImageUrl())
                .build();
    }
}
