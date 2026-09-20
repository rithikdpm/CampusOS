package com.campusos.controller;

import com.campusos.dto.AssignFacultyDto;
import com.campusos.dto.CreateSubjectDto;
import com.campusos.model.Subject;
import com.campusos.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody CreateSubjectDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.createSubject(dto));
    }

    @PostMapping("/assign-faculty")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Subject> assignFaculty(@Valid @RequestBody AssignFacultyDto dto) {
        return ResponseEntity.ok(subjectService.assignFacultyToSubject(dto));
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/course/{courseId}/semester/{semester}")
    public ResponseEntity<List<Subject>> getSubjectsBySemester(@PathVariable Long courseId, @PathVariable int semester) {
        return ResponseEntity.ok(subjectService.getSubjectsByCourseAndSemester(courseId, semester));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Subject>> getSubjectsByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(subjectService.getSubjectsByFaculty(facultyId));
    }
}