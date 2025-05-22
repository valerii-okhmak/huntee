package org.dreamteam.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OAuthLoginRequest {
    private String providerName;
    private String providerUserId;
    private String email;
    private String firstName;
    private String lastName;
    private String imageUrl;
    private String accessToken;
    private String refreshToken;
    private LocalDateTime expiresAt;
}
