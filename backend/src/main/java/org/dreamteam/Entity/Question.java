package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "questionId")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name ="question_id")
    private UUID questionId;

    @Column(name = "question_text", columnDefinition= "TEXT", nullable = false)
    private String questionText;

    @Column(name = "image_url") 
    private String imageUrl; 

    @Column(name = "comment", columnDefinition= "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name= "question_type", nullable= false)
    private QuestionType questionType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ChoiceOption> choiceOptions = new HashSet<>();

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private TextAnswer textAnswer;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<MatchingPair> matchingPairs = new HashSet<>();
    
    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private CodeAnswer codeAnswer;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    @OneToMany(mappedBy= "question", cascade= CascadeType.ALL, orphanRemoval=true, fetch= FetchType.LAZY)
    private Set <TestQuestion> testQuestions = new HashSet<>();

    @Column(name = "weight", nullable = false)
    private Double weight = 1.0;

    @ElementCollection(targetClass = QuestionCategory.class, fetch = FetchType.LAZY)
    @CollectionTable(
            name = "question_categories",
            joinColumns = @JoinColumn(name = "question_id") 
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "category_name", nullable = false)
    private Set <QuestionCategory> categories = new HashSet<>();

    public Question(String questionText, QuestionType questionType, User author) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.author = author;
    }
}