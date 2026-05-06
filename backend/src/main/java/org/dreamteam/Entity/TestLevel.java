package org.dreamteam.Entity;
import jakarta.persistence.*;


@Entity
public class TestLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    private Double orderIndex;
    @Column(name = "weight")
    private Double weight;
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

}