package org.dreamteam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.dreamteam.Entity.TestLevel;
import java.util.Optional;

@Repository
public interface TestLevelRepository extends JpaRepository<TestLevel, Long> {
    Optional<TestLevel> findByNameIgnoreCase(String name);

}
