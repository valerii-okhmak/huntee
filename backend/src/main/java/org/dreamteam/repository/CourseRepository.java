package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
        List<Course> findByUserId(Integer userId);
            long countByUserId(Integer userId);
}
