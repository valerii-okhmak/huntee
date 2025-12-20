package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    // Створимо токен автоматично при створенні об'єкта
    /*@PrePersist
    public void generateToken() {
        if (this.token == null) {
            this.token = UUID.randomUUID().toString();
        }
        if (this.status == null) {
            this.status = InvitationStatus.PENDING;
        }
    }
 */
    public TestInvitation(Test test, String email, String token, InvitationStatus status) {
        this.test = test;
        this.email = email;
        this.token = token;
        this.status = status;
    }
}

