package org.dreamteam.repository;

import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID; 

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

    List<TestQuestion> findByTest_TestId(UUID testId);
    
    int countByTest_TestId(UUID testId);
    Optional<TestQuestion> findByTest_TestIdAndQuestion_QuestionId(UUID testId, UUID questionId);

    Optional<TestQuestion> findByTestAndQuestion(Test test, Question question);
}