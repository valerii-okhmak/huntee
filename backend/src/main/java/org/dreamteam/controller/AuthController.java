package org.dreamteam.controller;

import org.dreamteam.dto.LoginRequest;
import org.dreamteam.dto.SignupRequest;
import org.dreamteam.dto.AuthResponse;
import org.dreamteam.model.AuthProvider;
import org.dreamteam.model.User;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;


    
    @PostMapping("/register")
    public String registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return "Email already taken!";
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setProvider(AuthProvider.LOCAL);
        userRepository.save(user);

        return "User registered successfully!";
    }

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
}
