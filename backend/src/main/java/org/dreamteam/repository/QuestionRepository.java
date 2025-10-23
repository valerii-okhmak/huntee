package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTest(Test test);
    List<Question> findByType(String type);
}
