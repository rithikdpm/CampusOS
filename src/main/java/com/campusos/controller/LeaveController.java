package com.campusos.controller;

import com.campusos.dto.ApplyLeaveDto;
import com.campusos.dto.ReviewLeaveDto;
import com.campusos.model.LeaveRequest;
import com.campusos.model.LeaveStatus;
import com.campusos.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Student applies for leave
    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public ResponseEntity<LeaveRequest> applyLeave(@Valid @RequestBody ApplyLeaveDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.applyLeave(dto));
    }

    // Faculty or Admin reviews the leave request
    @PostMapping("/review")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<LeaveRequest> reviewLeave(@Valid @RequestBody ReviewLeaveDto dto) {
        return ResponseEntity.ok(leaveService.reviewLeave(dto));
    }

    // Student checks their leave history
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getStudentLeaves(@PathVariable Long studentId) {
        return ResponseEntity.ok(leaveService.getStudentLeaves(studentId));
    }

    // Faculty or Admin filters leaves by status (e.g. PENDING)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN') or hasAnyAuthority('ROLE_FACULTY', 'ROLE_ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getLeavesByStatus(@PathVariable LeaveStatus status) {
        return ResponseEntity.ok(leaveService.getLeavesByStatus(status));
    }
}