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
@EqualsAndHashCode(of = {"prompt", "answer"})
public class MatchingPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pair_id")
    private Long pairId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "prompt_text", columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answer;

    public MatchingPair(Question question, String prompt, String answer) {
        this.question = question;
        this.prompt = prompt;
        this.answer = answer;
    }
}