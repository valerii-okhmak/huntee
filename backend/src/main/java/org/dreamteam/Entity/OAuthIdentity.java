package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "oauth_identities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthIdentity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private OAuthProvider provider;
    
    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;
    
    @Column(name = "access_token", columnDefinition = "TEXT", nullable = false)
    private String accessToken;
    
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;
    
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(name = "access_token_expires_at")
    private LocalDateTime accessTokenExpiresAt;

    @Column(name = "refresh_token_expires_at")
    private LocalDateTime refreshTokenExpiresAt;

}
