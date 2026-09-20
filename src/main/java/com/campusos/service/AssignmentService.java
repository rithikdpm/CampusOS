package com.campusos.service;

import com.campusos.dto.CreateAssignmentDto;
import com.campusos.dto.GradeSubmissionDto;
import com.campusos.dto.SubmitAssignmentDto;
import com.campusos.model.*;
import com.campusos.repository.AssignmentRepository;
import com.campusos.repository.AssignmentSubmissionRepository;
import com.campusos.repository.StudentRepository;
import com.campusos.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             AssignmentSubmissionRepository submissionRepository,
                             SubjectRepository subjectRepository,
                             StudentRepository studentRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }

    public Assignment createAssignment(CreateAssignmentDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        Assignment assignment = new Assignment(
                dto.getTitle(),
                dto.getDescription(),
                subject,
                dto.getDueDate(),
                dto.getMaxMarks()
        );

        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsBySubject(Long subjectId) {
        return assignmentRepository.findBySubjectId(subjectId);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(SubmitAssignmentDto dto) {
        Assignment assignment = assignmentRepository.findById(dto.getAssignmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with ID: " + dto.getAssignmentId()));

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        if (submissionRepository.findByAssignmentIdAndStudentId(dto.getAssignmentId(), dto.getStudentId()).isPresent()) {
            throw new IllegalArgumentException("Student has already submitted this assignment.");
        }

        SubmissionStatus status = LocalDateTime.now().isAfter(assignment.getDueDate()) 
                ? SubmissionStatus.LATE 
                : SubmissionStatus.SUBMITTED;

        AssignmentSubmission submission = new AssignmentSubmission(assignment, student, dto.getSubmissionContent(), status);
        return submissionRepository.save(submission);
    }

    @Transactional
    public AssignmentSubmission gradeSubmission(GradeSubmissionDto dto) {
        AssignmentSubmission submission = submissionRepository.findById(dto.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + dto.getSubmissionId()));

        if (dto.getMarksAwarded() > submission.getAssignment().getMaxMarks()) {
            throw new IllegalArgumentException("Awarded marks cannot exceed assignment maximum of: " 
                    + submission.getAssignment().getMaxMarks());
        }

        submission.setMarksAwarded(dto.getMarksAwarded());
        submission.setFacultyFeedback(dto.getFacultyFeedback());
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setReviewedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    public List<AssignmentSubmission> getSubmissionsForAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<AssignmentSubmission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}