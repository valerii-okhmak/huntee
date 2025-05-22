package org.dreamteam.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String to, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Email Verification");
        
        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #333;'>Welcome to Huntee!</h2>"
                + "<p>Thank you for registering. Please use the following verification code to complete your registration:</p>"
                + "<h1 style='color: #007bff; font-size: 32px; letter-spacing: 2px;'>" + verificationCode + "</h1>"
                + "<p>This code will expire in 60 minutes.</p>"
                + "<p>If you didn't request this verification, please ignore this email.</p>"
                + "<p>Best regards,<br>The Huntee Team</p>"
                + "</div>";
        
        helper.setText(content, true);
        mailSender.send(message);
    }
}
