package org.dreamteam.controller;

import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.Notification;
import org.dreamteam.service.NotificationService;
import org.dreamteam.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Controller", description = "API для повідомлень")
public class NotificationController {

    private final NotificationService notificationService;
    private final ProfileService profileService; // Щоб отримати ID користувача

    @Operation(summary = "Отримати мої повідомлення")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Отримуємо ID користувача через профіль або репозиторій
        Integer userId = profileService.getProfileResponseByEmail(userDetails.getUsername()).getUser_id();
        
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
    
    @Operation(summary = "Позначити повідомлення як прочитане")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Integer userId = profileService.getProfileResponseByEmail(userDetails.getUsername()).getUser_id();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }
    
    // Ендпоінт для ручної відправки повідомлення (наприклад, HR студенту)
    @Operation(summary = "Надіслати повідомлення користувачу")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestParam Integer recipientId,
            @RequestParam String title,
            @RequestBody String message,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Integer senderId = profileService.getProfileResponseByEmail(userDetails.getUsername()).getUser_id();
        notificationService.sendNotification(recipientId, senderId, title, message);
        return ResponseEntity.ok().body("Notification sent");
    }
}