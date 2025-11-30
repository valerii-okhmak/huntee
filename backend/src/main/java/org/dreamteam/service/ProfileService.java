package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.dreamteam.Entity.Course;
import org.dreamteam.Entity.Education;
import org.dreamteam.Entity.Experience;
import org.dreamteam.Entity.Profile;
import org.dreamteam.Entity.ProfileLink;
import org.dreamteam.Entity.User;
import org.dreamteam.dto.CourseRequest;
import org.dreamteam.dto.CourseResponse;
import org.dreamteam.dto.EducationRequest;
import org.dreamteam.dto.EducationResponse;
import org.dreamteam.dto.ExperienceRequest;
import org.dreamteam.dto.ExperienceResponse;
import org.dreamteam.dto.ProfileLinkRequest;
import org.dreamteam.dto.ProfileLinkResponse;
import org.dreamteam.dto.ProfileResponse;
import org.dreamteam.exception.ResourceNotFoundException;
import org.dreamteam.repository.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ProfileLinkRepository profileLinkRepository;
    private final EducationRepository educationRepository;
    private final CourseRepository courseRepository;
    private final OAuthIdentityRepository oAuthIdentityRepository;
    private final ExperienceRepository experienceRepository;


    public Profile getProfileByEmail(String email) {
        User user = getUserByEmail(email);
        return profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user ID: " + user.getId()));
    }

    public ProfileResponse getProfileByUserId(UUID userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Профіль не знайдено для ID: " + userId));
        return mapToProfileResponse(profile);
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

    public ProfileResponse updateBirthDate(String email, String birthDateStr) {
        Profile profile = getProfileByEmail(email);
        try {
            LocalDate birthDate = LocalDate.parse(birthDateStr);
            profile.setBirthDate(birthDate);
            profileRepository.save(profile);
            return mapToProfileResponse(profile);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format: " + birthDateStr);
        }
    }

    public ProfileResponse updateAbout(String email, String about) {
        Profile profile = getProfileByEmail(email);
        profile.setAbout(about);
        profileRepository.save(profile);
        return mapToProfileResponse(profile);
    }

    private ProfileResponse mapToProfileResponse(Profile profile) {
        Integer[] provider = oAuthIdentityRepository.findByUserId(profile.getUser().getId())
                .stream()
                .map(identity -> identity.getProvider().getId())
                .toArray(Integer[]::new);
        return ProfileResponse.builder()
                .user_id(profile.getUser().getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .birthDate(profile.getBirthDate())
                .profileImage(profile.getProfileImageUrl())
                .about(profile.getAbout())
                .providerID(provider)
                .build();
    }

    public ProfileResponse saveProfileImage(String email, MultipartFile file) {
        Profile profile = getProfileByEmail(email);
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String uploadDir = "backend/uploads/avatars/";

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = fileName;
            profile.setProfileImageUrl(fileUrl);
            profileRepository.save(profile);

            return mapToProfileResponse(profile);

        } catch (IOException e) {
            throw new RuntimeException("Не вдалося зберегти файл: " + e.getMessage());
        }
    }


    // ====== LINK ======
    public List<ProfileLinkResponse> getLinksByUserId(UUID userId) {
        return profileLinkRepository.findByUserId(userId).stream()
                .map(this::mapToLinkResponse)
                .toList();
    }

    public List<ProfileLinkResponse> getLinks(String email) {
        UUID userId = getUserId(email);
        return profileLinkRepository.findByUserId(userId).stream()
                .map(this::mapToLinkResponse)
                .toList();
    }

    public ProfileLinkResponse addLink(String email, ProfileLinkRequest request) {
        UUID userId = getUserId(email);
        if (profileLinkRepository.countByUserId(userId) >= 5) {
            throw new IllegalStateException("Maximum 5 profile links allowed per user");
        }

        ProfileLink link = new ProfileLink();
        link.setType(request.getType());
        link.setUrl(request.getUrl());
        link.setUser(getUserByEmail(email));
        ProfileLink saved = profileLinkRepository.save(link);
        return mapToLinkResponse(saved);
    }

    public void deleteLink(String email, Long linkId) throws AccessDeniedException {
        ProfileLink link = profileLinkRepository.findById(linkId)
                .orElseThrow(() -> new EntityNotFoundException("Link not found with ID: " + linkId));

        if (!link.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to delete this link.");
        }

        profileLinkRepository.deleteById(linkId);
    }

    private ProfileLinkResponse mapToLinkResponse(ProfileLink link) {
        return ProfileLinkResponse.builder()
                .id(link.getId())
                .type(link.getType())
                .url(link.getUrl())
                .build();
    }


    // ====== EDUCATION ======
    public List<EducationResponse> getEducationsByUserId(UUID userId) {
        return educationRepository.findByUserId(userId).stream()
                .map(this::mapEducationToResponse)
                .toList();
    }

    public List<EducationResponse> getEducations(String email) {
        UUID userId = getUserId(email);
        return educationRepository.findByUserId(userId).stream()
                .map(this::mapEducationToResponse)
                .toList();
    }

    public EducationResponse addEducation(String email, EducationRequest request) {
        UUID userId = getUserId(email);
        if (educationRepository.countByUserId(userId) >= 5) {
            throw new IllegalStateException("Maximum 5 education entries allowed per user");
        }

        Education education = new Education();
        education.setInstitution(request.getInstitution());
        education.setSpecialties(request.getSpecialities());
        education.setUser(getUserByEmail(email));

        Education savedEducation = educationRepository.save(education);
        return mapEducationToResponse(savedEducation);
    }

    public void deleteEducation(String email, Long educationId) throws AccessDeniedException {
        UUID userId = getUserId(email); 

        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with ID: " + educationId));

        if (!education.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to delete this education");
        }

        educationRepository.delete(education);
    }

    private EducationResponse mapEducationToResponse(Education education) {
        return EducationResponse.builder()
                .id(education.getId())
                .institution(education.getInstitution())
                .specialities(education.getSpecialties())
                .build();
    }

    // ====== COURSE ======
    public List<CourseResponse> getCoursesByUserId(UUID userId) {
        return courseRepository.findByUserId(userId).stream()
                .map(this::mapCourseToResponse)
                .toList();
    }

    public List<CourseResponse> getCourses(String email) {
        UUID userId = getUserId(email);
        return courseRepository.findByUserId(userId).stream()
                .map(this::mapCourseToResponse)
                .toList();
    }

    public CourseResponse addCourse(String email, CourseRequest request) {
        UUID userId = getUserId(email);
        if (courseRepository.countByUserId(userId) >= 5) {
            throw new IllegalStateException("Maximum 5 courses allowed per user");
        }

        Course course = new Course();
        course.setCourse_name(request.getCourse_name());
        course.setCertificateUrl(request.getCertificateUrl());
        course.setDescription(request.getDescription());
        course.setUser(getUserByEmail(email));

        Course saved = courseRepository.save(course);
        return mapCourseToResponse(saved);
    }

    public void deleteCourse(String email, Long courseId) throws AccessDeniedException {
        UUID userId = getUserId(email); 

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        if (!course.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to delete this course");
        }

        courseRepository.delete(course);
    }

    private CourseResponse mapCourseToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .course_name(course.getCourse_name())
                .certificateUrl(course.getCertificateUrl())
                .description(course.getDescription())
                .build();
    }


    // ====== EXPERIENCE ======
    public List<ExperienceResponse> getExperiencesByUserId(UUID userId) {
        return experienceRepository.findByUserId(userId).stream()
                .map(this::mapExperienceToResponse)
                .toList();
    }

    public List<ExperienceResponse> getExperiences(String email) {
        UUID userId = getUserId(email);
        return experienceRepository.findByUserId(userId).stream()
                .map(this::mapExperienceToResponse)
                .toList();
    }

    public ExperienceResponse addExperience(String email, ExperienceRequest request) {
        UUID userId = getUserId(email);
        if (experienceRepository.countByUserId(userId) >= 5) {
            throw new IllegalStateException("Maximum 5 experiences allowed per user");
        }

        Experience experience = new Experience();
        experience.setProjectName(request.getProjectName());
        experience.setProjectUrl(request.getProjectUrl());
        experience.setDescription(request.getDescription());
        experience.setUser(getUserByEmail(email));

        Experience saved = experienceRepository.save(experience);
        return mapExperienceToResponse(saved);
    }

    public void deleteExperience(String email, Long experienceId) throws AccessDeniedException {
        UUID userId = getUserId(email); 

        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with ID: " + experienceId));

        if (!experience.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to delete this experience");
        }

        experienceRepository.delete(experience);
    }

    private ExperienceResponse mapExperienceToResponse(Experience experience) {
        return ExperienceResponse.builder()
                .id(experience.getId())
                .projectName(experience.getProjectName())
                .projectUrl(experience.getProjectUrl())
                .description(experience.getDescription())
                .build();
    }


    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private UUID getUserId(String email) {
        return getUserByEmail(email).getId();
    }
}