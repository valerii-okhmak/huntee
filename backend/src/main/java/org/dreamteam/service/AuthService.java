package org.dreamteam.service;

import org.dreamteam.dto.*;
import org.dreamteam.exception.ResourceNotFoundException;
import org.dreamteam.Entity.*;
import org.dreamteam.repository.OAuthIdentityRepository;
import org.dreamteam.repository.OAuthProviderRepository;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.repository.UserTypeRepository;
import org.dreamteam.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import javax.mail.MessagingException;



@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final OAuthProviderRepository oauthProviderRepository;
    private final OAuthIdentityRepository oauthIdentityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public ResponseEntity<?> register(RegisterRequest request) throws MessagingException {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email вже зареєстровано");
        }

        UserType userType = userTypeRepository.findByName(request.getUserType().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Невірний тип користувача"));

        String verificationCode = generateVerificationCode();

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .verificationCode(verificationCode)
                .isVerified(false)
                .userType(userType)
                .build();

        Profile profile = Profile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        user.setProfile(profile);
        userRepository.save(user);
        emailService.sendVerificationEmail(request.getEmail(), verificationCode);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        OAuthProvider localProvider = oauthProviderRepository.findByName("local")
                .orElseThrow(() -> new ResourceNotFoundException("OAuth Provider 'local' не знайдено"));

        OAuthIdentity identity = OAuthIdentity.builder()
                .user(user)
                .provider(localProvider)
                .providerUserId(user.getEmail())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresAt(null)
                .build();

        oauthIdentityRepository.save(identity);

        AuthResponse response = createAuthResponse(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Transactional
    public ResponseEntity<?> verifyEmail(VerificationRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndVerificationCode(request.getEmail(), request.getCode());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Невірний email або код підтвердження");
        }

        User user = userOpt.get();
        user.setIsVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return ResponseEntity.ok("Email успішно підтверджено");
    }

    @Transactional
    public ResponseEntity<?> login(AuthRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Невірна електронна адреса або пароль");
        }
    
        if (!(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Невірний об'єкт авторизації");
        }
    
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
    
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
    
        OAuthProvider localProvider = oauthProviderRepository.findByName("local")
                .orElseThrow(() -> new ResourceNotFoundException("OAuth Provider 'local' не знайдено"));
    
        OAuthIdentity identity = oauthIdentityRepository
                .findByProviderAndProviderUserId(localProvider, user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("OAuth identity не знайдено"));
    
        identity.setAccessToken(newAccessToken);
        identity.setRefreshToken(newRefreshToken);
        identity.setExpiresAt(null); 
    
        oauthIdentityRepository.save(identity); 
    
        AuthResponse response = AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .userType(user.getUserType().getName())
                .firstName(user.getProfile().getFirstName())
                .lastName(user.getProfile().getLastName())
                .profileImage(user.getProfile().getProfileImageUrl())
                .build();
    
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<?> refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        Optional<OAuthIdentity> identityOpt = oauthIdentityRepository.findByRefreshToken(refreshToken);

        if (identityOpt.isEmpty() || identityOpt.get().getExpiresAt() != null &&
                identityOpt.get().getExpiresAt().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(401).body("Недійсний або протермінований refresh token");
        }

        User user = identityOpt.get().getUser();
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user); 

        identityOpt.get().setAccessToken(newAccessToken);
        identityOpt.get().setRefreshToken(newRefreshToken); 
        oauthIdentityRepository.save(identityOpt.get());

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .userType(user.getUserType().getName())
                .firstName(user.getProfile().getFirstName())
                .lastName(user.getProfile().getLastName())
                .profileImage(user.getProfile().getProfileImageUrl())
                .build());
        }

    @Transactional
    public ResponseEntity<?> processOAuthLogin(String providerName, String providerUserId, String email,
                                               String firstName, String lastName, String imageUrl,
                                               String accessToken, String refreshToken, LocalDateTime expiresAt) {

        OAuthProvider provider = oauthProviderRepository.findByName(providerName)
                .orElseThrow(() -> new ResourceNotFoundException("OAuth provider not found"));

        Optional<OAuthIdentity> existingOAuthIdentity = oauthIdentityRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        User user;
        if (existingOAuthIdentity.isPresent()) {
            OAuthIdentity oauthIdentity = existingOAuthIdentity.get();
            oauthIdentity.setAccessToken(accessToken);
            oauthIdentity.setRefreshToken(refreshToken);
            oauthIdentity.setExpiresAt(expiresAt);
            oauthIdentityRepository.save(oauthIdentity);
            user = oauthIdentity.getUser();
        } else {
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                UserType userType = userTypeRepository.findByName(UserType.USER)
                        .orElseThrow(() -> new ResourceNotFoundException("Default user type not found"));

                user = User.builder()
                        .email(email)
                        .isVerified(true)
                        .userType(userType)
                        .build();

                Profile profile = Profile.builder()
                        .user(user)
                        .firstName(firstName)
                        .lastName(lastName)
                        .profileImageUrl(imageUrl)
                        .build();

                user.setProfile(profile);
                userRepository.save(user);
            }

            OAuthIdentity oauthIdentity = OAuthIdentity.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(providerUserId)
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresAt(expiresAt)
                    .build();

            oauthIdentityRepository.save(oauthIdentity);
        }

        AuthResponse response = createAuthResponse(user);
        return ResponseEntity.ok(response);
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .userType(user.getUserType().getName())
                .firstName(user.getProfile().getFirstName())
                .lastName(user.getProfile().getLastName())
                .profileImage(user.getProfile().getProfileImageUrl())
                .build();
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); 
        return String.valueOf(code);
    }
}