package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.dreamteam.dto.ProfileLinkRequest;
import org.dreamteam.dto.ProfileLinkResponse;
import org.dreamteam.service.JwtService;
import org.dreamteam.service.ProfileLinkService;
import org.dreamteam.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/links")
@RequiredArgsConstructor
public class ProfileLinkController {
    private final ProfileService profileService;
    private final JwtService jwtService;
    @GetMapping
    public List<ProfileLinkResponse> getLinks(@RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.getLinks(email);
    }
    @PostMapping
    public ProfileLinkResponse addLink(@RequestParam("token") String token, @RequestBody ProfileLinkRequest request) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.addLink(email, request);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLink(@RequestParam("token") String token, @PathVariable Long id) throws AccessDeniedException {
        profileService.deleteLink(token, id);
        return ResponseEntity.noContent().build();
    }
    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }

    @GetMapping("/user_id")
    public List<ProfileLinkResponse> getLinksByUserId(@RequestParam Integer userId) {
        return profileService.getLinksByUserId(userId);
    }
}

