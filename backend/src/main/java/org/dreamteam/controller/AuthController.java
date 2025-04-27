package org.dreamteam.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.dreamteam.dto.*;
import org.dreamteam.model.AuthProvider;
import org.dreamteam.model.User;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.service.EmailService;
import org.dreamteam.service.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for registration, confirmation and login")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    private final Map<String, TempUser> pendingUsers = new HashMap<>();
    private final Random random = new Random();

    @Operation(summary = "Register user", description = "Register a user and send confirmation code to email")
    @ApiResponse(responseCode = "200", description = "Confirmation code sent")
    @PostMapping("/register")
    public String registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return "Email already taken!";
        }

        String verificationCode = String.format("%06d", random.nextInt(999999));
        TempUser tempUser = new TempUser(
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                verificationCode
        );
        pendingUsers.put(signUpRequest.getEmail(), tempUser);

        emailService.sendEmail(signUpRequest.getEmail(), "Confirmation Code", "Your confirmation code is: " + verificationCode);

        return "Confirmation code sent to your email.";
    }

    @Operation(summary = "Confirm registration", description = "Confirm user registration with the code sent to email")
    @ApiResponse(responseCode = "200", description = "User registered successfully")
    @PostMapping("/confirm")
    public String confirmUser(@RequestBody ConfirmRequest confirmRequest) {
        TempUser tempUser = pendingUsers.get(confirmRequest.getEmail());

        if (tempUser == null) {
            return "No pending registration found for this email!";
        }

        if (!tempUser.getVerificationCode().equals(confirmRequest.getCode())) {
            return "Invalid confirmation code!";
        }

        User user = new User();
        user.setFirstName(tempUser.getFirstName());
        user.setLastName(tempUser.getLastName());
        user.setEmail(tempUser.getEmail());
        user.setPassword(tempUser.getPassword());
        user.setProvider(AuthProvider.LOCAL);
        userRepository.save(user);

        pendingUsers.remove(confirmRequest.getEmail());

        return "User registered successfully!";
    }

    @Operation(summary = "Login", description = "Authenticate user and get JWT token")
    @ApiResponse(responseCode = "200", description = "User authenticated")
    @PostMapping("/login")
    public AuthResponse authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials!");
        }

        String token = tokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    private static class TempUser {
        private final String firstName;
        private final String lastName;
        private final String email;
        private final String password;
        private final String verificationCode;

        public TempUser(String firstName, String lastName, String email, String password, String verificationCode) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.password = password;
            this.verificationCode = verificationCode;
        }

        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public String getVerificationCode() { return verificationCode; }
    }
}
