package org.dreamteam.repository;

import org.dreamteam.Entity.TextAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TextAnswerRepository extends JpaRepository<TextAnswer, Long> {

    Optional<TextAnswer> findByQuestion_QuestionId(UUID questionId);

}