package com.campusos.controller;

import com.campusos.dto.AttendanceEntryDto;
import com.campusos.dto.AttendanceSummaryDto;
import com.campusos.dto.BulkAttendanceDto;
import com.campusos.model.Attendance;
import com.campusos.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // 1. Single-student attendance logging (matches FacultyDashboard.jsx single form)
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<Attendance> markAttendance(@Valid @RequestBody AttendanceEntryDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.markAttendance(dto));
    }

    // 2. Bulk attendance logging (for multi-student rosters)
    @PostMapping("/mark-bulk")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<Attendance>> markBulkAttendance(@Valid @RequestBody BulkAttendanceDto dto) {
        return ResponseEntity.ok(attendanceService.markBulkAttendance(dto));
    }

    // View attendance by subject & date
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<Attendance>> getBySubjectAndDate(
            @PathVariable Long subjectId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceBySubjectAndDate(subjectId, date));
    }

    // View overall logs for a student
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceRecords(studentId));
    }

    // View attendance percentage summary for a student in a specific subject
    @GetMapping("/summary/student/{studentId}/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<AttendanceSummaryDto> getStudentSubjectSummary(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        return ResponseEntity.ok(attendanceService.getStudentSubjectSummary(studentId, subjectId));
    }
}