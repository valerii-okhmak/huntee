package org.dreamteam.service;

import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.Notification;
import org.dreamteam.Entity.User;
import org.dreamteam.dto.NotificationResponse;
import org.dreamteam.repository.NotificationRepository;
import org.dreamteam.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public void sendNotification(Integer recipientId, Integer senderId, String title, String message) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        
        User sender = null;
        if (senderId != null) {
            sender = userRepository.findById(senderId).orElse(null);
        }


        Notification notification = new Notification(recipient, sender, title, message);
        notificationRepository.save(notification);

        try {
            emailService.sendEmail(recipient.getEmail(), title, message);
        } catch (Exception e) {
            System.err.println("Error sending email notification: " + e.getMessage());
        }
    }
    
    @Transactional
    public void sendSystemNotification(Integer recipientId, String title, String message) {
        sendNotification(recipientId, null, title, message);
    }

    public List<NotificationResponse> getUserNotifications(Integer userId) {
        List<Notification> notifications = notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(userId);
        
        return notifications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private NotificationResponse mapToDTO(Notification notification) {
        NotificationResponse.SenderDTO senderDTO = null;
        
        if (notification.getSender() != null) {
            String name = "Unknown";
            String avatar = null;
            
            if (notification.getSender().getProfile() != null) {
                name = notification.getSender().getProfile().getFirstName() + " " + 
                       notification.getSender().getProfile().getLastName();
                avatar = notification.getSender().getProfile().getProfileImageUrl();
            }
            
            senderDTO = NotificationResponse.SenderDTO.builder()
                    .name(name)
                    .avatarUrl(avatar)
                    .build();
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .sender(senderDTO)
                .build();
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}