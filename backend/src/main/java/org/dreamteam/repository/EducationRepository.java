package org.dreamteam.repository;

import java.util.List;
import java.util.UUID;

import org.dreamteam.Entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByUserId(UUID userId); 
        long countByUserId(UUID userId);
} 
