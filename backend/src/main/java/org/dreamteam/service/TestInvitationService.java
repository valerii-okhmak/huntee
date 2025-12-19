package org.dreamteam.service;

import org.dreamteam.repository.TestInvitationRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestInvitationService {
    private final EmailService emailService;
    private final TestInvitationRepository invitationRepository;
    
}
