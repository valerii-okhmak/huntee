package org.dreamteam.repository;

import org.dreamteam.Entity.TestAccessCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestAccessCodeRepository extends JpaRepository<TestAccessCode, UUID> {
    
    Optional<TestAccessCode> findByCode(String code);
    
    List<TestAccessCode> findAllByTest_TestIdOrderByCreatedAtDesc(UUID testId);
    
    Optional<TestAccessCode> findByTest_TestIdAndUsedByUser_Id(UUID testId, UUID userId);

    @Query("SELECT DISTINCT t.tag FROM TestAccessCode t WHERE t.test.testId = :testId AND t.tag IS NOT NULL")
    List<String> findUniqueTagsByTestId(@Param("testId") UUID testId);
}