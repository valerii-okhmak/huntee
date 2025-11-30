package org.dreamteam.repository;

import org.dreamteam.Entity.UserTestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserTestAttemptRepository extends JpaRepository<UserTestAttempt, UUID> {
    List<UserTestAttempt> findByUser_Id(UUID userId);
    List<UserTestAttempt> findByTest_TestId(UUID testId);
    List<UserTestAttempt> findByCompletedAtIsNull();
}