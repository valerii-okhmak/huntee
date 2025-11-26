package org.dreamteam.Entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "sphere")
    private String sphere;

    @Column(name = "level")
    private String level;

    @Column(name = "city")
    private String city;

    @Column(name = "vacancy_description", columnDefinition = "TEXT")
    private String vacancyDescription;

    @Column(name = "responsibilities", columnDefinition = "TEXT")
    private String responsibilities; 
    
    @Column(name = "is_fixed_time")
    private boolean isFixedTime; 

    @Column(name = "start_time")
    private LocalDateTime startTime; 

    @Column(name = "end_time")
    private LocalDateTime endTime; 

    @Column(name = "duration_minutes") 
    private Integer durationMinutes; 
    

    @OneToMany(mappedBy= "test", cascade= CascadeType.ALL, orphanRemoval= true)
    private Set<TestQuestion> testQuestions = new HashSet<>();

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserTestAttempt> userTestAttempts = new HashSet<>();


    public Test(String testName, User user) {
        this.testName = testName;
        this.user = user;
    }
}