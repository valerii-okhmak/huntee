package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_invitations")
@Data
@NoArgsConstructor
public class TestInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID invitationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    

    public TestInvitation(Test test, String email, String token, InvitationStatus status, OffsetDateTime expiresAt) {
        this.test = test;
        this.email = email;
        this.token = token;
        this.status = status;
        this.expiresAt = expiresAt;
    }
}

