package com.campusos.repository;

import com.campusos.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientUserId);

    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Long recipientUserId);

    long countByRecipientIdAndReadFalse(Long recipientUserId);
}