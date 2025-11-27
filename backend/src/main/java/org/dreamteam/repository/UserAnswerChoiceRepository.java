package org.dreamteam.repository;
import org.dreamteam.Entity.UserAnswerChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserAnswerChoiceRepository extends JpaRepository<UserAnswerChoice, Long> {

    List<UserAnswerChoice> findByUserAnswer_UserAnswerId(Long userAnswerId);
}