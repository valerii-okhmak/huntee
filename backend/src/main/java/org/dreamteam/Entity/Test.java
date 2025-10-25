package org.dreamteam.Entity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "test")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "testId")


public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id")
    private Long testId;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @OneToMany(mappedBy= "test", cascade= CascadeType.ALL, orphanRemoval= true)
    private Set<TestQuestion> testQuestions = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Test(String testName, User user) {
        this.testName = testName;
        this.user = user;
    }
}