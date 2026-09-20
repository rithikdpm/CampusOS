package com.campusos.service;

import com.campusos.model.Notification;
import com.campusos.model.NotificationType;
import com.campusos.model.User;
import com.campusos.repository.NotificationRepository;
import com.campusos.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification sendNotification(Long recipientUserId, String title, String message, NotificationType type) {
        User recipient = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found with User ID: " + recipientUserId));

        Notification notification = new Notification(recipient, title, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(String userEmail, boolean unreadOnly) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        if (unreadOnly) {
            return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(user.getId());
        }
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        return notificationRepository.countByRecipientIdAndReadFalse(user.getId());
    }

    @Transactional
    public Notification markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));

        if (!notification.getRecipient().getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalArgumentException("Unauthorized to modify this notification.");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}