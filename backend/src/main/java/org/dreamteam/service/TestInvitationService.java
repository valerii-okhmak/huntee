package org.dreamteam.service;

import org.dreamteam.repository.*;
import org.dreamteam.Entity.*;
import org.dreamteam.service.*;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class TestInvitationService {

    private final TestRepository testRepository;
    private final EmailService emailService;
    private final TestInvitationRepository invitationRepository;

    @Transactional
    public void sendInvitation(UUID testId, String userEmail) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        
        if(!Boolean.TRUE.equals(test.getIsPrivate())) {
            throw new IllegalArgumentException("Цей тест є публічним. Інвайт не потрібен.");
        }

        boolean invitationExists = invitationRepository.existsByTestAndEmailAndStatus(test, userEmail, InvitationStatus.PENDING);

        if (invitationExists) {
            throw new IllegalStateException("Активне запрошення вже надіслано на " + userEmail);
        }

        TestInvitation invitation = new TestInvitation();
        invitation.setTest(test);
        invitation.setEmail(userEmail);
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setExpiresAt(OffsetDateTime.now().plusDays(2)); // уточнити формат дати

        if(invitation.getToken() == null) {
            invitation.setToken(UUID.randomUUID().toString());
        }

        invitationRepository.save(invitation);

        String title = "Запрошення до участі в тесті: " + test.getTestName();
        String message = "Вас запрошено до участі в тесті \"" + test.getTestName() + "\".";
        message += "\nЩоб прийняти запрошення, будь ласка, скористайтеся наступним посиланням: ";
        message += "\nhttp://your-frontend-url.com/accept-invitation?token=" + invitation.getToken();
        message += "\nЗапрошення дійсне до: " + invitation.getExpiresAt().toString();

        try {
            emailService.sendEmail(userEmail, title, message);
        } catch (Exception e) {
            System.err.println("Error sending invitation email: " + e.getMessage());
        }
        
    }

    @Transactional
    public TestInvitation validateAndConsumeToken(String token) {
        TestInvitation invitation = invitationRepository.findByToken(token)
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("Недійсний токен запрошення."));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new AccessDeniedException("Запрошення було вже використано або скасовано.");
        }
        
        // 2. Виправлено: використовуємо OffsetDateTime.now() замість LocalDateTime
        if (invitation.getExpiresAt().isBefore(OffsetDateTime.now())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new AccessDeniedException("Термін дії запрошення минув.");
        }

        invitation.setStatus(InvitationStatus.USED);
        return invitationRepository.save(invitation);
    }
}
