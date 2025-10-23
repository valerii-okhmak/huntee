package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "userAnswerId")

public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_answer_id")
    private Long userAnswerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private UserTestAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "given_text", columnDefinition = "TEXT", nullable = true)
    private String givenText;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @OneToMany(mappedBy = "userAnswer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserAnswerChoice> choices = new HashSet<>();

    @OneToMany(mappedBy = "userAnswer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserAnswerMatching> matchings = new HashSet<>();

    public UserAnswer(UserTestAttempt attempt, Question question) {
        this.attempt = attempt;
        this.question = question;
    }
    
}
