package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "code_answer")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "answerId")
public class CodeAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Column(name = "template_code", columnDefinition = "TEXT")
    private String templateCode;

    @Column(name = "test_cases", columnDefinition = "TEXT", nullable = false)
    private String testCases;

    public CodeAnswer(Question question, String templateCode, String testCases) {
        this.question = question;
        this.templateCode = templateCode;
        this.testCases = testCases;
    }
}