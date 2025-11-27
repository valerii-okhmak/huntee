package org.dreamteam.repository;

import org.dreamteam.Entity.TestRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestRegistrationRepository extends JpaRepository<TestRegistration, Long> {
    boolean existsByUser_IdAndTest_TestId(Integer userId, Long testId);
    List<TestRegistration> findByUser_Id(Integer userId);
    List<TestRegistration> findByTest_TestId(Long testId);
}