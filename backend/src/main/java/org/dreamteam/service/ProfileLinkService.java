package org.dreamteam.service;

import java.util.List;

import org.dreamteam.Entity.ProfileLink;
import org.dreamteam.Entity.User;
import org.dreamteam.dto.ProfileLinkRequest;
import org.dreamteam.dto.ProfileLinkResponse;
import org.dreamteam.repository.ProfileLinkRepository;
import org.dreamteam.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileLinkService {

    private final ProfileLinkRepository profileLinkRepository;
    private final UserRepository userRepository;

    public List<ProfileLinkResponse> getAllLinks(String email) {
        User user = getUserByEmail(email);
        return profileLinkRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProfileLinkResponse addLink(String email, ProfileLinkRequest request) {
        User user = getUserByEmail(email);
        ProfileLink link = ProfileLink.builder()
                .type(request.getType())
                .url(request.getUrl())
                .user(user)
                .build();
        profileLinkRepository.save(link);
        return mapToResponse(link);
    }

    public void deleteLink(Long linkId) {
        profileLinkRepository.deleteById(linkId);
    }

    private ProfileLinkResponse mapToResponse(ProfileLink link) {
        return ProfileLinkResponse.builder()
                .id(link.getId())
                .type(link.getType())
                .url(link.getUrl())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
