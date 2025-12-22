package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "test_question", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"test_id", "question_id"})
})
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = {"test", "question"})

public class TestQuestion {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "test_id", nullable=false)
    private Test test;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "question_id", nullable=false)
    private Question question;

    @Column(name = "order_index")
    private Integer orderIndex;

    public TestQuestion(Test test, Question question, Integer orderIndex) {
        this.test = test;
        this.question = question;
        this.orderIndex = orderIndex;
    }    
}
