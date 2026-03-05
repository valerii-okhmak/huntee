package org.dreamteam.service;

import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.TestAccessCode;
import org.dreamteam.Entity.User;
import org.dreamteam.repository.TestAccessCodeRepository;
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestAccessCodeService {

    private final TestAccessCodeRepository accessCodeRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final TestService testService; 

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public List<String> generateCodes(UUID testId, String tag, int count, String authorEmail) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));

        if (!test.getUser().getEmail().equals(authorEmail)) {
            throw new AccessDeniedException("Only the test author can generate access codes");
        }

        List<TestAccessCode> newCodes = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            String generatedString = generateUniqueCode();
            
            TestAccessCode code = TestAccessCode.builder()
                    .test(test)
                    .code(generatedString)
                    .tag(tag)
                    .isUsed(false)
                    .build();
            newCodes.add(code);
        }

        accessCodeRepository.saveAll(newCodes);

        return newCodes.stream()
                .map(TestAccessCode::getCode)
                .collect(Collectors.toList());
    }

    @Transactional
    public UUID activateCode(String codeString, String studentEmail) {
        TestAccessCode accessCode = accessCodeRepository.findByCode(codeString.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Недійсний код доступу"));

        if (accessCode.isUsed()) {
            throw new IllegalStateException("Цей код вже був використаний іншим учасником");
        }

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new EntityNotFoundException("Користувача не знайдено"));

        testService.registerForTest(accessCode.getTest().getTestId(), studentEmail);

        accessCode.setUsed(true);
        accessCode.setUsedByUser(student);
        accessCodeRepository.save(accessCode);

        return accessCode.getTest().getTestId();
    }

    private String generateUniqueCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        sb.insert(3, "-"); 
        return sb.toString();
    }
}