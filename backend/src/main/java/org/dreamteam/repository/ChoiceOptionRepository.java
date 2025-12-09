package org.dreamteam.repository;

import org.dreamteam.Entity.ChoiceOption;
import org.dreamteam.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChoiceOptionRepository extends JpaRepository<ChoiceOption, Long> {

    List<ChoiceOption> findByQuestion_QuestionId(UUID questionId);
    List<ChoiceOption> findByQuestionAndIsCorrectTrue(Question question);
}
