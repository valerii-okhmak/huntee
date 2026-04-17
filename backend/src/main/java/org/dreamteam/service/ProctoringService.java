package org.dreamteam.service;
import java.util.List;
import java.util.UUID;
import org.dreamteam.dto.ProctoringLogCreateRequest;
import org.dreamteam.dto.ProctoringLogResponse;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProctoringService {
    public void saveLogs(UUID attemptId, List<ProctoringLogCreateRequest> logs) {
        // Логіку пізніше дороблю
    }

    public List<ProctoringLogResponse> getLogsForAttempt(UUID attemptId) {
        // Логіку пізніше дороблю
        return List.of();
    }

}