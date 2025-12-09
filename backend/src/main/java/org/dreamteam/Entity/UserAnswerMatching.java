package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_answer_matching", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_answer_id", "prompt_pair_id"})
})
@Getter
@Setter
@NoArgsConstructor 
@EqualsAndHashCode(of = {"userAnswer", "matchingPair"}) 
public class UserAnswerMatching {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_answer_id", nullable = false)
    private UserAnswer userAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_pair_id", nullable = false)
    private MatchingPair matchingPair;

    @Column(name = "selected_answer_text", columnDefinition = "TEXT", nullable = false)
    private String selectedAnswerText;

    public UserAnswerMatching(UserAnswer userAnswer, MatchingPair matchingPair, String selectedAnswerText) {
        this.userAnswer = userAnswer;
        this.matchingPair = matchingPair;
        this.selectedAnswerText = selectedAnswerText;
    }
}