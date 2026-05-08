package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user_test_attempt")
@Getter
@Setter
@NoArgsConstructor 
@EqualsAndHashCode(of = "attemptId")

public class UserTestAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "attempt_id")
    private UUID attemptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "completed_at") 
    private OffsetDateTime completedAt;

    @Column(precision = 5, scale = 2) 
    private BigDecimal score;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    @OneToMany(mappedBy = "userTestAttempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ProctoringLog> proctoringLogs = new HashSet<>();

    public UserTestAttempt(User user, Test test) {
        this.user = user;
        this.test = test;
        this.startedAt = OffsetDateTime.now();
    }    
}
