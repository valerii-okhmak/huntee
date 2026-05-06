package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_level", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "test_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class TestLevel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "order_index")
    private Double orderIndex;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "questions_limit")
    private Integer questionsLimit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;
}