package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_registration", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "test_id"}) 
})
@Getter
@Setter
@NoArgsConstructor
public class TestRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    public TestRegistration(User user, Test test) {
        this.user = user;
        this.test = test;
        this.registeredAt = LocalDateTime.now();
    }
}