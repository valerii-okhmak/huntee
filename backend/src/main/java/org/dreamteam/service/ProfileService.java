package org.dreamteam.service;

import org.dreamteam.Entity.Profile;
import org.dreamteam.Entity.User;
import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.repository.ProfileRepository;
import org.dreamteam.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public Profile getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return profileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("Profile not found"));
    }

    public ProfileResponse getProfileResponseByEmail(String email) {
        Profile profile = getProfileByEmail(email);
        return mapToProfileResponse(profile);
    }

    public ProfileResponse updateFirstName(String email, String firstName) {
        Profile profile = getProfileByEmail(email);
        profile.setFirstName(firstName);
        profileRepository.save(profile);
        return mapToProfileResponse(profile);
    }

    public ProfileResponse updateLastName(String email, String lastName) {
        Profile profile = getProfileByEmail(email);
        profile.setLastName(lastName);
        profileRepository.save(profile);
        return mapToProfileResponse(profile);
    }

    public ProfileResponse updateProfileImage(String email, String imageUrl) {
        Profile profile = getProfileByEmail(email);
        profile.setProfileImageUrl(imageUrl);
        profileRepository.save(profile);
        return mapToProfileResponse(profile);
    }

    public ProfileResponse updateAbout(String email, String about) {
        Profile profile = getProfileByEmail(email);
        profile.setAbout(about);
        profileRepository.save(profile);
        return mapToProfileResponse(profile);
    }

    private ProfileResponse mapToProfileResponse(Profile profile) {
        return ProfileResponse.builder()
            .firstName(profile.getFirstName())
            .lastName(profile.getLastName())
            .profileImage(profile.getProfileImageUrl())
            .about(profile.getAbout())
            .build();
    }
}
