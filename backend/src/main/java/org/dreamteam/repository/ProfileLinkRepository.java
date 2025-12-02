package org.dreamteam.repository;

import java.util.List;
import java.util.UUID;

import org.dreamteam.Entity.ProfileLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileLinkRepository extends JpaRepository<ProfileLink, Long> {
    List<ProfileLink> findByUserId(UUID userId);
    long countByUserId(UUID userId);
}
