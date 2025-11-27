package org.dreamteam.repository;

import org.dreamteam.Entity.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional; 

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

    List<TestQuestion> findByTest_TestId(Long testId);
    
    int countByTest_TestId(Long testId);
        Optional<TestQuestion> findByTestTestIdAndQuestionQuestionId(Long testId, Long questionId);
}