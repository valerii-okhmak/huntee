package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "proctoring_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProctoringLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime timestamp;
    @Enumerated(EnumType.STRING)
    private ProctoringEventType eventType;
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_test_attempt_id", nullable = false)
    private UserTestAttempt userTestAttempt;
}
