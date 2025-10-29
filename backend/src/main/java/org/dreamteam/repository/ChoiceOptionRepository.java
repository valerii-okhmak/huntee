package org.dreamteam.repository;

import org.dreamteam.Entity.ChoiceOption;
import org.dreamteam.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChoiceOptionRepository extends JpaRepository<ChoiceOption, Long> {

    List<ChoiceOption> findByQuestion_QuestionId(Long questionId);
    List<ChoiceOption> findByQuestionAndIsCorrectTrue(Question question);
}
