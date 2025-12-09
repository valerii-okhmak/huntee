package org.dreamteam.repository;

import java.util.List;
import java.util.UUID;

import org.dreamteam.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
        List<Course> findByUserId(UUID userId);
            long countByUserId(UUID userId);
}
