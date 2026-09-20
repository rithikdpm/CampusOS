package com.campusos.controller;

import com.campusos.dto.ApplyJobDto;
import com.campusos.dto.CreateJobPostingDto;
import com.campusos.model.JobApplication;
import com.campusos.model.JobPosting;
import com.campusos.service.PlacementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/placement")
public class PlacementController {

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }

    // 1. Get all active jobs (matches GET /api/v1/placement/jobs)
    @GetMapping("/jobs")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_PLACEMENT_OFFICER', 'ROLE_ADMIN')")
    public ResponseEntity<List<JobPosting>> getActiveJobs() {
        return ResponseEntity.ok(placementService.getActiveJobs());
    }

    // 2. Get applications for a student (matches GET /api/v1/placement/applications/student/{studentId})
    @GetMapping("/applications/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_PLACEMENT_OFFICER', 'ROLE_ADMIN')")
    public ResponseEntity<List<JobApplication>> getStudentApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(placementService.getStudentApplications(studentId));
    }

    // 3. Apply for job
    @PostMapping("/apply")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<JobApplication> applyForJob(@Valid @RequestBody ApplyJobDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(placementService.applyForJob(dto));
    }
}