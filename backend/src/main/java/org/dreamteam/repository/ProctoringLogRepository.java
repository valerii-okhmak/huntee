package org.dreamteam.repository;
import org.dreamteam.Entity.ProctoringLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProctoringLogRepository extends JpaRepository<ProctoringLog, UUID> {
    List<ProctoringLog> findByUserTestAttemptAttemptIdOrderByTimestampAsc(UUID attemptId);
    
}
