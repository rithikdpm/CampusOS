package com.campusos.controller;

import com.campusos.dto.CreateFacultyProfileDto;
import com.campusos.dto.CreateStudentProfileDto;
import com.campusos.model.Faculty;
import com.campusos.model.Student;
import com.campusos.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/students")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Student> createStudentProfile(@Valid @RequestBody CreateStudentProfileDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.createStudentProfile(dto));
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(profileService.getAllStudents());
    }

    @GetMapping("/students/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN', 'ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getStudentByUserId(userId));
    }

    @PostMapping("/faculty")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Faculty> createFacultyProfile(@Valid @RequestBody CreateFacultyProfileDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.createFacultyProfile(dto));
    }

    @GetMapping("/faculty")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(profileService.getAllFaculty());
    }

    @GetMapping("/faculty/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<Faculty> getFacultyByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getFacultyByUserId(userId));
    }
    @DeleteMapping("/faculty/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        profileService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }
}