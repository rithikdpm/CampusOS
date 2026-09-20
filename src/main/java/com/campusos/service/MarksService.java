package com.campusos.service;

import com.campusos.dto.StudentTranscriptDto;
import com.campusos.dto.UploadMarksDto;
import com.campusos.model.ExamType;
import com.campusos.model.Marks;
import com.campusos.model.Student;
import com.campusos.model.Subject;
import com.campusos.repository.MarksRepository;
import com.campusos.repository.StudentRepository;
import com.campusos.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public MarksService(MarksRepository marksRepository,
                        StudentRepository studentRepository,
                        SubjectRepository subjectRepository) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional
    public Marks uploadOrUpdateMarks(UploadMarksDto dto) {
        if (dto.getMarksObtained() > dto.getMaxMarks()) {
            throw new IllegalArgumentException("Marks obtained cannot exceed maximum marks.");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        ExamType examType = ExamType.valueOf(dto.getExamType());

        Marks marks = marksRepository.findByStudentIdAndSubjectIdAndExamType(
                student.getId(),
                subject.getId(),
                examType
        ).orElseGet(() -> {
            Marks newMarks = new Marks();
            newMarks.setStudent(student);
            newMarks.setSubject(subject);
            newMarks.setExamType(examType);
            return newMarks;
        });

        marks.setMarksObtained(dto.getMarksObtained());
        marks.setMaxMarks(dto.getMaxMarks());
        marks.setComments(dto.getComments());
        marks.calculateGrade();

        return marksRepository.save(marks);
    }

    public List<Marks> getMarksBySubject(Long subjectId) {
        return marksRepository.findBySubjectId(subjectId);
    }

    public List<Marks> getStudentMarks(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    // Required by PlacementService
    public StudentTranscriptDto getStudentTranscript(Long studentId) {
        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        if (marksList.isEmpty()) {
            return new StudentTranscriptDto(studentId, 0.0, marksList);
        }

        double totalObtained = 0.0;
        double totalMax = 0.0;

        for (Marks m : marksList) {
            if (m.getMaxMarks() > 0) {
                totalObtained += m.getMarksObtained();
                totalMax += m.getMaxMarks();
            }
        }

        double overallPercentage = (totalMax > 0) ? (totalObtained / totalMax) * 100.0 : 0.0;
        return new StudentTranscriptDto(studentId, Math.round(overallPercentage * 100.0) / 100.0, marksList);
    }
}