package org.dreamteam.repository;

import org.dreamteam.Entity.ProfileLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LinkRepository extends JpaRepository<ProfileLink, Long> {}
