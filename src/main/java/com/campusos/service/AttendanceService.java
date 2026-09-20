package com.campusos.service;

import com.campusos.dto.AttendanceEntryDto;
import com.campusos.dto.AttendanceSummaryDto;
import com.campusos.dto.BulkAttendanceDto;
import com.campusos.model.*;
import com.campusos.repository.AttendanceRepository;
import com.campusos.repository.StudentRepository;
import com.campusos.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             SubjectRepository subjectRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional
    public List<Attendance> markBulkAttendance(BulkAttendanceDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        List<Attendance> savedRecords = new ArrayList<>();

        for (AttendanceEntryDto entry : dto.getEntries()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + entry.getStudentId()));

            // Update if already exists for this date, otherwise create new
            Attendance record = attendanceRepository
                    .findByStudentIdAndSubjectIdAndAttendanceDate(student.getId(), subject.getId(), dto.getAttendanceDate())
                    .orElse(new Attendance(student, subject, dto.getAttendanceDate(), entry.getStatus(), entry.getRemarks()));

            record.setStatus(entry.getStatus());
            record.setRemarks(entry.getRemarks());
            savedRecords.add(attendanceRepository.save(record));
        }

        return savedRecords;
    }

    public List<Attendance> getAttendanceBySubjectAndDate(Long subjectId, LocalDate date) {
        return attendanceRepository.findBySubjectIdAndAttendanceDate(subjectId, date);
    }

    public List<Attendance> getStudentAttendanceRecords(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public AttendanceSummaryDto getStudentSubjectSummary(Long studentId, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + subjectId));

        long total = attendanceRepository.countByStudentIdAndSubjectId(studentId, subjectId);
        long attended = attendanceRepository.countByStudentIdAndSubjectIdAndStatus(studentId, subjectId, AttendanceStatus.PRESENT);

        double percentage = total == 0 ? 0.0 : Math.round(((double) attended / total) * 10000.0) / 100.0;

        return new AttendanceSummaryDto(subject.getId(), subject.getName(), subject.getCode(), total, attended, percentage);
    }
    public Attendance markAttendance(AttendanceEntryDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        // Check if an existing record exists for this date, or create a new one
        LocalDate recordDate = dto.getDate() != null ? dto.getDate() : dto.getAttendanceDate();

        Attendance record = attendanceRepository
                .findByStudentIdAndSubjectIdAndAttendanceDate(student.getId(), subject.getId(), recordDate)
                .orElse(new Attendance());

        record.setStudent(student);
        record.setSubject(subject);
        record.setAttendanceDate(recordDate);
        record.setStatus(dto.getStatus());
        record.setRemarks(dto.getRemarks());

        return attendanceRepository.save(record);
    }
}