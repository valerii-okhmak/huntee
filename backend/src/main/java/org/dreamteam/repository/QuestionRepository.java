package org.dreamteam.repository;

import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {  
    List<Question> findByQuestionType(QuestionType questionType);
    List<Question> findAllByAuthor_Email(String email);
}