package com.campusos.controller;

import com.campusos.dto.CreateAssignmentDto;
import com.campusos.dto.GradeSubmissionDto;
import com.campusos.dto.SubmitAssignmentDto;
import com.campusos.model.Assignment;
import com.campusos.model.AssignmentSubmission;
import com.campusos.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // Faculty or Admin creates an assignment
    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<Assignment> createAssignment(@Valid @RequestBody CreateAssignmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assignmentService.createAssignment(dto));
    }

    // View assignments for a subject
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<Assignment>> getAssignmentsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsBySubject(subjectId));
    }

    // Student submits assignment
    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public ResponseEntity<AssignmentSubmission> submitAssignment(@Valid @RequestBody SubmitAssignmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assignmentService.submitAssignment(dto));
    }

    // Faculty grades submission
    @PostMapping("/grade")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<AssignmentSubmission> gradeSubmission(@Valid @RequestBody GradeSubmissionDto dto) {
        return ResponseEntity.ok(assignmentService.gradeSubmission(dto));
    }

    // Faculty views all submissions for an assignment
    @GetMapping("/{assignmentId}/submissions")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getSubmissionsForAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getSubmissionsForAssignment(assignmentId));
    }

    // Student views all their submissions
    @GetMapping("/student/{studentId}/submissions")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(assignmentService.getSubmissionsByStudent(studentId));
    }
}