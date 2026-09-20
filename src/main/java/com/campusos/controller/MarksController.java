package com.campusos.controller;

import com.campusos.dto.StudentTranscriptDto;
import com.campusos.dto.UploadMarksDto;
import com.campusos.model.Marks;
import com.campusos.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping("/entry")
    @PreAuthorize("hasAuthority('ROLE_FACULTY')")
    public ResponseEntity<Marks> uploadMarks(@Valid @RequestBody UploadMarksDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marksService.uploadOrUpdateMarks(dto));
    }

    // Required by StudentPortal.jsx
    @GetMapping("/transcript/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<StudentTranscriptDto> getStudentTranscript(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getStudentTranscript(studentId));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<Marks>> getStudentMarks(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getStudentMarks(studentId));
    }
}