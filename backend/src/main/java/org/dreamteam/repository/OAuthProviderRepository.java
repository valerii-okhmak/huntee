package org.dreamteam.repository;


import org.dreamteam.Entity.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuthProviderRepository extends JpaRepository<OAuthProvider, Integer> {
    Optional<OAuthProvider> findByName(String name);
}