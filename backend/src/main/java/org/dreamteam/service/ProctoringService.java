package org.dreamteam.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.dreamteam.dto.ProctoringLogCreateRequest;
import org.dreamteam.dto.ProctoringLogResponse;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.dreamteam.repository.UserTestAttemptRepository;
import org.dreamteam.Entity.UserTestAttempt;
import org.dreamteam.Entity.ProctoringLog;
import java.util.stream.Collectors;
import org.dreamteam.repository.ProctoringLogRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProctoringService {
    private final UserTestAttemptRepository userTestAttemptRepository;
    private final ProctoringLogRepository proctoringLogRepository;

    @Transactional
    public void saveLogs(UUID attemptId, List<ProctoringLogCreateRequest> logs) {
        UserTestAttempt attempt = userTestAttemptRepository.findById(attemptId)
        .orElseThrow(()-> new EntityNotFoundException());

        List<ProctoringLog> logsToSave = logs.stream().map(request -> {
            ProctoringLog log = new ProctoringLog();
            log.setUserTestAttempt(attempt);
            log.setEventType(request.getEventType());
            log.setDescription(request.getDescription());
            log.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
            return log;
        }).collect(Collectors.toList());

        proctoringLogRepository.saveAll(logsToSave);
    }

    @Transactional(readOnly = true)
    public List<ProctoringLogResponse> getLogsForAttempt(UUID attemptId) {
        List<ProctoringLog> logs = proctoringLogRepository.findByUserTestAttemptAttemptIdOrderByTimestampAsc(attemptId);
        return logs.stream().map(log -> ProctoringLogResponse.builder()
                .id(log.getId())
                .timestamp(log.getTimestamp())
                .eventType(log.getEventType())
                .description(log.getDescription())
                .build()
        ).collect(Collectors.toList());
    }
}

