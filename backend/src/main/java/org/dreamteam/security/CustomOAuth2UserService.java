package org.dreamteam.security;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.dreamteam.service.AuthService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthService authService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerUserId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String imageUrl = oAuth2User.getAttribute("picture");

        String accessToken = userRequest.getAccessToken().getTokenValue();
        String refreshToken = null;
        LocalDateTime expiresAt = userRequest.getAccessToken().getExpiresAt().atZone(ZoneId.systemDefault()).toLocalDateTime();

        authService.processOAuthLogin(provider, providerUserId, email, firstName, lastName, imageUrl, accessToken, refreshToken, expiresAt);

        return oAuth2User;
    }
}

