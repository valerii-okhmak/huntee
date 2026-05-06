package org.dreamteam.repository;

import org.dreamteam.Entity.TestLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TestLevelRepository extends JpaRepository<TestLevel, Long> {
       Optional<TestLevel> findByTest_TestIdAndNameIgnoreCase(UUID testId, String name);
}