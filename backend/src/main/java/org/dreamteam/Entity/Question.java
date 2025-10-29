package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "questionId")

public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="question_id")
    private Long questionId;

    @Column(name = "question_text", columnDefinition= "TEXT", nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name= "question_type", nullable= false)
    private QuestionType questionType;

    // --- Зв'язки з таблицями "правильних" відповідей ---
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ChoiceOption> choiceOptions = new HashSet<>();

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private TextAnswer textAnswer;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<MatchingPair> matchingPairs = new HashSet<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    // --- Зв'язок з тестами ---
    @OneToMany(mappedBy= "question", cascade= CascadeType.ALL, orphanRemoval=true, fetch= FetchType.LAZY)
    private Set <TestQuestion> testQuestions = new HashSet<>();


    public Question(String questionText, QuestionType questionType) {
        this.questionText = questionText;
        this.questionType = questionType;
    }

}
