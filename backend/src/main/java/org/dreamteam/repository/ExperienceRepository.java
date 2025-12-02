package org.dreamteam.repository;

import java.util.List;
import java.util.UUID;

import org.dreamteam.Entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
        List<Experience> findByUserId(UUID userId);
            long countByUserId(UUID userId);
}
