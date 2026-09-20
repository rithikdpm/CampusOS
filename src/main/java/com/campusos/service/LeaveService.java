package com.campusos.service;

import com.campusos.dto.ApplyLeaveDto;
import com.campusos.dto.ReviewLeaveDto;
import com.campusos.model.Faculty;
import com.campusos.model.LeaveRequest;
import com.campusos.model.LeaveStatus;
import com.campusos.model.Student;
import com.campusos.repository.FacultyRepository;
import com.campusos.repository.LeaveRequestRepository;
import com.campusos.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        StudentRepository studentRepository,
                        FacultyRepository facultyRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public LeaveRequest applyLeave(ApplyLeaveDto dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be prior to start date.");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        LeaveRequest request = new LeaveRequest(student, dto.getStartDate(), dto.getEndDate(), dto.getReason());
        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest reviewLeave(ReviewLeaveDto dto) {
        if (dto.getStatus() == LeaveStatus.PENDING) {
            throw new IllegalArgumentException("Review decision must be either APPROVED or REJECTED.");
        }

        LeaveRequest request = leaveRequestRepository.findById(dto.getLeaveRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found with ID: " + dto.getLeaveRequestId()));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found with ID: " + dto.getFacultyId()));

        request.setStatus(dto.getStatus());
        request.setReviewedBy(faculty);
        request.setReviewRemarks(dto.getReviewRemarks());
        request.setReviewedAt(LocalDateTime.now());

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getStudentLeaves(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId);
    }

    public List<LeaveRequest> getLeavesByStatus(LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }
}