package org.dreamteam.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.dreamteam.Entity.Course;
import org.dreamteam.dto.CourseRequest;
import org.dreamteam.dto.CourseResponse;
import org.dreamteam.service.JwtService;
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
@RequestMapping("/api/profile/courses")
@RequiredArgsConstructor
public class CourseController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    @GetMapping
    public List<CourseResponse> getCourses(@RequestParam("token") String token) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.getCourses(email);
    }

    @PostMapping
    public CourseResponse addCourse(@RequestParam("token") String token, @RequestBody CourseRequest request) {
        String email = jwtService.extractUsername(cleanToken(token));
        return profileService.addCourse(email, request); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@RequestParam("token") String token, @PathVariable Long id) throws AccessDeniedException {
        profileService.deleteCourse(token, id);
        return ResponseEntity.noContent().build();
    }

    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}
