package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;
import org.dreamteam.dto.CourseRequest;
import org.dreamteam.dto.CourseResponse;
import org.dreamteam.service.ProfileService;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
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
@RequestMapping("/api/profile/courses")
@RequiredArgsConstructor
public class CourseController {

    private final ProfileService profileService;

    @GetMapping
    public List<CourseResponse> getCourses(Authentication authentication) {
        String email = authentication.getName(); 
        return profileService.getCourses(email);
    }

    @PostMapping
    public CourseResponse addCourse(Authentication authentication, @RequestBody CourseRequest request) {
        String email = authentication.getName();
        return profileService.addCourse(email, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        try {
            profileService.deleteCourse(email, id); 
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/user_id")
    public List<CourseResponse> getCoursesByUserId(@RequestParam UUID  userId) {
        return profileService.getCoursesByUserId(userId);
    }
}