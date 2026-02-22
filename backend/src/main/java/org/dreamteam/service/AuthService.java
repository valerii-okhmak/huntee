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

import jakarta.mail.MessagingException;

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
        // Перевірка на корпоративну пошту політехніки
        String email = request.getEmail();
        if (email == null ) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Дозволено лише реєстрація з корпоративною поштою @lpnu.ua");
    }
    //
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email вже зареєстровано");
        }
        if (!isStrongPassword(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "Пароль має містити щонайменше 8 символів і принаймні два з трьох: літери, цифри, спеціальні символи.");
        }

        UserType userType = userTypeRepository.findByName("USER")
        .orElseThrow(() -> new ResourceNotFoundException("User type 'USER' не знайдено"));


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
                .accessTokenExpiresAt(LocalDateTime.now().plusDays(1))
                .refreshTokenExpiresAt(LocalDateTime.now().plusDays(7))
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
        // Перевірка на корпоративну пошту політехніки
        String email = request.getEmail();
        if (email == null) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Дозволено лише вхід з корпоративною поштою @lpnu.ua");
        }
        //
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
        identity.setAccessTokenExpiresAt(LocalDateTime.now().plusDays(1));
        identity.setRefreshTokenExpiresAt(LocalDateTime.now().plusDays(7));


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
    public ResponseEntity<?> changePassword(ChangePasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Користувача не знайдено");
        }

        User user = userOpt.get();

        Optional<OAuthProvider> localProviderOpt = oauthProviderRepository.findByName("LOCAL");
        if (localProviderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Провайдер LOCAL не знайдено");
        }

        OAuthProvider localProvider = localProviderOpt.get();
        boolean isLocalUser = oauthIdentityRepository
                .findByUserIdAndProviderId(user.getId(), localProvider.getId())
                .isPresent();

        if (!isLocalUser) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Зміна пароля доступна лише для користувачів, зареєстрованих через локальний акаунт");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Старий пароль неправильний");
        }

        if (!isStrongPassword(request.getNewPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "Новий пароль повинен містити щонайменше 8 символів і хоча б два з трьох: літери, цифри, спецсимволи");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Пароль успішно змінено");
    }
    
    @Transactional
    public ResponseEntity<?> refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        Optional<OAuthIdentity> identityOpt = oauthIdentityRepository.findByRefreshToken(refreshToken);

        if (identityOpt.isEmpty() || identityOpt.get().getRefreshTokenExpiresAt() != null &&
                identityOpt.get().getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(401).body("Недійсний або протермінований refresh token");
        }

        User user = identityOpt.get().getUser();
        String newAccessToken = jwtService.generateToken(user);


        OAuthIdentity identity = identityOpt.get();
        identity.setAccessToken(newAccessToken);
        identity.setAccessTokenExpiresAt(LocalDateTime.now().plusDays(1));
        oauthIdentityRepository.save(identity);

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
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

        // Перевірка на корпоративну пошту пошту політехніки для Google
        if("google".equalsIgnoreCase(providerName)){
            if(email == null){
                return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Дозволено лише вхід з корпоративною поштою @lpnu.ua");
            }
        }
        //
        if (providerUserId == null || providerUserId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provider User ID is required.");
        }

        OAuthProvider provider = oauthProviderRepository.findByName(providerName)
                .orElseThrow(() -> new ResourceNotFoundException("OAuth provider not found: " + providerName));

        Optional<OAuthIdentity> identityOpt = oauthIdentityRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        User user;
        if (identityOpt.isPresent()) {
            OAuthIdentity identity = identityOpt.get();
            identity.setAccessToken(accessToken);
            identity.setRefreshToken(refreshToken);
            identity.setAccessTokenExpiresAt(expiresAt != null ? expiresAt : LocalDateTime.now().plusDays(1));
            oauthIdentityRepository.save(identity);
            user = identity.getUser();

        } else {
            
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                user = userOpt.get();
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

            OAuthIdentity newIdentity = OAuthIdentity.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(providerUserId)
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .accessTokenExpiresAt(expiresAt != null ? expiresAt : LocalDateTime.now().plusDays(1))
                    .build();
            oauthIdentityRepository.save(newIdentity);
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

    private boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) return false;

        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecial = password.matches(".*[!@#$%^&*(),.?\":{}|<>\\[\\]\\\\/+=_-].*");

        int count = 0;
        if (hasLetter) count++;
        if (hasDigit) count++;
        if (hasSpecial) count++;

        return count >= 2;
    }
}