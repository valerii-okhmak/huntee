package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.Answer;
import org.dreamteam.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion(Question question);
    List<Answer> findByQuestionAndCorrectTrue(Question question);
}
