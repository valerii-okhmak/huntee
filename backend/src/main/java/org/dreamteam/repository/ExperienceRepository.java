package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
        List<Experience> findByUserId(Integer userId);
            long countByUserId(Integer userId);
}
