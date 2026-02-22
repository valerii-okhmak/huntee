package org.dreamteam.repository;

import org.dreamteam.Entity.TestRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TestRegistrationRepository extends JpaRepository<TestRegistration, Long> {
    boolean existsByUser_IdAndTest_TestId(UUID userId, UUID testId);
    List<TestRegistration> findByUser_Id(UUID userId);
    List<TestRegistration> findByTest_TestId(UUID testId);
}