package com.campusos.controller;

import com.campusos.dto.CreateAnnouncementDto;
import com.campusos.model.Announcement;
import com.campusos.model.Role;
import com.campusos.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // 1. Fetch announcements based on the user's role
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT', 'ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<List<Announcement>> getAnnouncements(Authentication authentication) {
        String roleStr = authentication.getAuthorities().iterator().next().getAuthority();
        Role userRole = Role.valueOf(roleStr);
        return ResponseEntity.ok(announcementService.getFeedForRole(userRole));
    }

    // 2. Create announcement with publisher email
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Announcement> createAnnouncement(
            @Valid @RequestBody CreateAnnouncementDto dto,
            Authentication authentication) {
        String publisherEmail = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(announcementService.createAnnouncement(dto, publisherEmail));
    }
}