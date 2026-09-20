package com.campusos.repository;

import com.campusos.model.Announcement;
import com.campusos.model.AnnouncementTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findAllByOrderByCreatedAtDesc();

    List<Announcement> findByTargetAudienceInOrderByCreatedAtDesc(List<AnnouncementTarget> targets);
}