package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByUserId(Integer userId); 
        long countByUserId(Integer userId);
} 
