package org.dreamteam.repository;

import org.dreamteam.Entity.UserTestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserTestAttemptRepository extends JpaRepository<UserTestAttempt, Long> {
    List<UserTestAttempt> findByUser_Id(Integer userId);
    List<UserTestAttempt> findByTest_TestId(Long testId);
    List<UserTestAttempt> findByCompletedAtIsNull();
}