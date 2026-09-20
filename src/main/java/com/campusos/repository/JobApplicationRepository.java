package com.campusos.repository;

import com.campusos.model.ApplicationStatus;
import com.campusos.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStudentId(Long studentId);
    List<JobApplication> findByJobPostingId(Long jobPostingId);
    Optional<JobApplication> findByJobPostingIdAndStudentId(Long jobPostingId, Long studentId);
    long countByStatus(ApplicationStatus status);
}