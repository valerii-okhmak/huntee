package org.dreamteam.repository;
import org.dreamteam.Entity.UserAnswerMatching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserAnswerMatchingRepository extends JpaRepository<UserAnswerMatching, Long> {

    List<UserAnswerMatching> findByUserAnswer_UserAnswerId(Long userAnswerId);
}