package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "matching_pair")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "pairId")

public class MatchingPair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pair_id")
    private Long pairId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Column(name = "prompt_text", columnDefinition = "TEXT", nullable = false)
    private String promptText;

    @Column(name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answerText;

    public MatchingPair(Question question, String promptText, String answerText) {
        this.question = question;
        this.promptText = promptText;
        this.answerText = answerText;
    } 
}
