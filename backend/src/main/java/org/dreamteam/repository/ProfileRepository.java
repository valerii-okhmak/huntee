package org.dreamteam.repository;

import java.util.Optional;
import java.util.UUID;

import org.dreamteam.Entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByUserId(UUID userId);
    
}
