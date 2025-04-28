package org.dreamteam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); // Встановлюємо UTF-8 кодування

            helper.setFrom("huntee.project@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);

            // HTML контент для красивого листа з UTF-8 кодуванням
            String emailContent = "<html>"
                                + "<body style='font-family: Arial, sans-serif;'>"
                                + "<div style='text-align: center; padding: 20px;'>"
                                + "<img src='http://localhost:8080/images/logo.png' alt='Logo' style='width: 150px; margin-bottom: 20px;' />"  // URL логотипу
                                + "<h2 style='color: #333;'>Вітаємо! Ваш код підтвердження</h2>"
                                + "<p style='font-size: 16px; color: #333;'>Ваш код підтвердження: </p>"
                                + "<h1 style='font-size: 48px; color: #FF5733; font-weight: bold; text-align: center;'>"
                                + verificationCode  // Вставляємо код підтвердження
                                + "</h1>"
                                + "<p style='font-size: 16px; color: #333;'>Цей код дійсний протягом 10 хвилин.</p>"
                                + "<p style='font-size: 14px; color: #555; text-align: center;'>"
                                + "<strong>Будь ласка, не передавайте цей код нікому!</strong><br/>"
                                + "Якщо ви не реєструвалися на нашому сайті, будь ласка, проігноруйте цей лист."
                                + "</p>"
                                + "</div>"
                                + "</body>"
                                + "</html>";

            // Встановлюємо HTML контент в лист
            helper.setText(emailContent, true);
            mailSender.send(message);  // Надсилаємо лист
        } catch (MessagingException e) {
            throw new RuntimeException("Не вдалося надіслати лист", e);
        }
    }
}
