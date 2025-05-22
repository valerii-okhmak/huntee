package org.dreamteam.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class GoogleOAuthRequest {
    private String providerUserId;
    private String email;
    private String firstName;
    private String lastName;
    private String imageUrl;
    private String accessToken;
    private String refreshToken;
    private LocalDateTime expiresAt;
}

