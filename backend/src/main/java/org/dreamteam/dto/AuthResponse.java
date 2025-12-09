package org.dreamteam.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private final String tokenType = "Bearer";
    private String userType;
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String profileImage;
}