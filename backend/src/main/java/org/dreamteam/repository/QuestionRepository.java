package org.dreamteam.repository;

import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByQuestionType(QuestionType questionType);
}