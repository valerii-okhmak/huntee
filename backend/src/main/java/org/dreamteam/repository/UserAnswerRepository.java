package org.dreamteam.repository;

import org.dreamteam.Entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    List<UserAnswer> findByAttempt_AttemptId(UUID attemptId);
    Optional<UserAnswer> findByAttempt_AttemptIdAndQuestion_QuestionId(UUID attemptId, UUID questionId);
}
