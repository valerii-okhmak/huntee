package org.dreamteam.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource; 
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

    @Async
    public void sendVerificationEmail(String to, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Email Verification");
        
        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;'>"
                + "<img src='cid:logoImage' alt='Huntee Logo' style='width: 150px; margin-bottom: 20px;'/>" 
                + "<h2 style='color: #333;'>Welcome to Huntee!</h2>"
                + "<p style='text-align: left;'>Thank you for registering. Please use the following verification code:</p>"
                + "<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>"
                + "<h1 style='color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;'>" + verificationCode + "</h1>"
                + "</div>"
                + "<p style='text-align: left; color: #777; font-size: 14px;'>This code will expire in 60 minutes.</p>"
                + "<p style='text-align: left;'>Best regards,<br>The Huntee Team</p>"
                + "</div>";
        
        helper.setText(content, true);

        try {
            ClassPathResource logoResource = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", logoResource);
        } catch (Exception e) {
            System.err.println("Logo file not found: " + e.getMessage());
        }

        mailSender.send(message);
    }

    @Async
    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);

        String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>"
                + "<div style='text-align: center; margin-bottom: 20px;'>"
                + "<img src='cid:logoImage' alt='Huntee Logo' style='width: 120px;'/>"
                + "</div>"
                + "<h2 style='color: #2c3e50; text-align: center;'>" + subject + "</h2>"
                + "<div style='font-size: 16px; color: #555; line-height: 1.6;'>"
                + body.replace("\n", "<br>")
                + "</div>"
                + "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>"
                + "<p style='font-size: 12px; color: #999; text-align: center;'>© Huntee </p>"
                + "<p style='font-size: 12px; color: #999; text-align: center;'>— This is your future! </p>"
                + "</div>";

        helper.setText(htmlContent, true);
        try {
            ClassPathResource logoResource = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", logoResource);
        } catch (Exception e) {
            System.err.println("Logo file not found: " + e.getMessage());
        }

        mailSender.send(message);
    }
}