package org.dreamteam.controller;

import org.dreamteam.dto.*;
import org.dreamteam.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "409", description = "Email already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid user type"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) throws MessagingException, javax.mail.MessagingException {
        return authService.register(request);
    }

    @Operation(summary = "Verify email with code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email successfully verified"),
            @ApiResponse(responseCode = "400", description = "Invalid email or verification code"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerificationRequest request) {
        return authService.verifyEmail(request);
    }

    @Operation(summary = "Login with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "500", description = "Authentication error")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Login via OAuth2")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OAuth login successful"),
            @ApiResponse(responseCode = "400", description = "Invalid provider or user data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/oauth-login")
    public ResponseEntity<?> oauthLogin(@RequestBody OAuthLoginRequest request) {
        return authService.processOAuthLogin(
                request.getProviderName(),
                request.getProviderUserId(),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getImageUrl(),
                request.getAccessToken(),
                request.getRefreshToken(),
                request.getExpiresAt()
        );
    }

    @Operation(summary = "Refresh JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request);
    }


    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleOAuthRequest request) {
        return authService.processOAuthLogin(
                "google",
                request.getProviderUserId(),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getImageUrl(),
                request.getAccessToken(),
                request.getRefreshToken(),
                request.getExpiresAt()
        );
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return authService.changePassword(request);
    }

}
