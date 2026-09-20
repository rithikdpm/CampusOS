package com.campusos.controller;

import com.campusos.model.Notification;
import com.campusos.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Get notifications for the authenticated user
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.getMyNotifications(authentication.getName(), unreadOnly));
    }

    // Get count of unread notifications for badge indicators
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // Mark notification as read
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId, authentication.getName()));
    }
}