package com.campusos.service;

import com.campusos.dto.CreateAnnouncementDto;
import com.campusos.model.Announcement;
import com.campusos.model.AnnouncementTarget;
import com.campusos.model.Role;
import com.campusos.model.User;
import com.campusos.repository.AnnouncementRepository;
import com.campusos.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository, UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    public Announcement createAnnouncement(CreateAnnouncementDto dto, String publisherEmail) {
        User publisher = userRepository.findByEmail(publisherEmail)
                .orElseThrow(() -> new IllegalArgumentException("Publisher user not found for email: " + publisherEmail));

        Announcement announcement = new Announcement(
                dto.getTitle(),
                dto.getContent(),
                dto.getTargetAudience(),
                dto.isImportant(),
                publisher
        );

        return announcementRepository.save(announcement);
    }

    public List<Announcement> getFeedForRole(Role role) {
        if (role == Role.ROLE_ADMIN) {
            return announcementRepository.findAllByOrderByCreatedAtDesc();
        } else if (role == Role.ROLE_STUDENT) {
            return announcementRepository.findByTargetAudienceInOrderByCreatedAtDesc(
                    List.of(AnnouncementTarget.ALL, AnnouncementTarget.STUDENTS_ONLY)
            );
        } else {
            // Faculty & Placement Officers
            return announcementRepository.findByTargetAudienceInOrderByCreatedAtDesc(
                    List.of(AnnouncementTarget.ALL, AnnouncementTarget.FACULTY_ONLY)
            );
        }
    }
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }
}