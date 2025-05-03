package org.dreamteam.repository;


import org.dreamteam.Entity.OAuthIdentity;
import org.dreamteam.Entity.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuthIdentityRepository extends JpaRepository<OAuthIdentity, Integer> {
    Optional<OAuthIdentity> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);
    Optional<OAuthIdentity> findByProvider_Name(String providerName);
    Optional<OAuthIdentity> findByRefreshToken(String refreshToken);

}