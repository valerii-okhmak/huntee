package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "text_answer")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "answerId")

public class TextAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Column(name = "correct_text", columnDefinition = "TEXT", nullable = false)
    private String correctText;

    @Column(name = "is_case_sensitive", nullable = false)
    private boolean isCaseSensitive = false;

    public TextAnswer(Question question, String correctText, boolean isCaseSensitive) {
        this.question = question;
        this.correctText = correctText;
        this.isCaseSensitive = isCaseSensitive;
    }
    
}
