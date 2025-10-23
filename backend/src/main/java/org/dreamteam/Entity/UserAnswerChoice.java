package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "user_answer_choice", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_answer_id", "selected_option_id"})
})
@Getter
@Setter
@NoArgsConstructor 
@EqualsAndHashCode(of = {"userAnswer", "selectedOption"}) 
public class UserAnswerChoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_answer_id", nullable = false)
    private UserAnswer userAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id", nullable = false)
    private ChoiceOption selectedOption;

    public UserAnswerChoice(UserAnswer userAnswer, ChoiceOption selectedOption) {
        this.userAnswer = userAnswer;
        this.selectedOption = selectedOption;
    }
}
