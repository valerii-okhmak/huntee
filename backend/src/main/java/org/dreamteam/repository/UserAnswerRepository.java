package org.dreamteam.repository;

import org.dreamteam.Entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    List<UserAnswer> findByAttempt_AttemptId(Long attemptId);
    Optional<UserAnswer> findByAttempt_AttemptIdAndQuestion_QuestionId(Long attemptId, Long questionId);
}
