package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user_answer_choice")
public class UserAnswerChoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_answer_id", nullable = false)
    // ВАЖЛИВО: Якщо видаляється UserAnswer, видаляємо і цей вибір
    @OnDelete(action = OnDeleteAction.CASCADE) 
    private UserAnswer userAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id", nullable = false)
    // ВАЖЛИВО: Якщо видаляється Option (через видалення питання), видаляємо і цей вибір
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ChoiceOption selectedOption;

    public UserAnswerChoice(UserAnswer userAnswer, ChoiceOption selectedOption) {
        this.userAnswer = userAnswer;
        this.selectedOption = selectedOption;
    }
}