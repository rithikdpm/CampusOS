package com.campusos.service;

import com.campusos.dto.AssignFacultyDto;
import com.campusos.dto.CreateSubjectDto;
import com.campusos.model.Course;
import com.campusos.model.Faculty;
import com.campusos.model.Subject;
import com.campusos.repository.CourseRepository;
import com.campusos.repository.FacultyRepository;
import com.campusos.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;

    public SubjectService(SubjectRepository subjectRepository,
                          CourseRepository courseRepository,
                          FacultyRepository facultyRepository) {
        this.subjectRepository = subjectRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
    }

    public Subject createSubject(CreateSubjectDto dto) {
        if (subjectRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Subject with code " + dto.getCode() + " already exists!");
        }

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + dto.getCourseId()));

        if (dto.getSemester() > course.getTotalSemesters()) {
            throw new IllegalArgumentException("Semester cannot exceed course maximum of " + course.getTotalSemesters());
        }

        Subject subject = new Subject(dto.getName(), dto.getCode(), dto.getCredits(), dto.getSemester(), course);
        return subjectRepository.save(subject);
    }

    public Subject assignFacultyToSubject(AssignFacultyDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found with ID: " + dto.getFacultyId()));

        subject.setFaculty(faculty);
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Subject> getSubjectsByCourseAndSemester(Long courseId, int semester) {
        return subjectRepository.findByCourseIdAndSemester(courseId, semester);
    }

    public List<Subject> getSubjectsByFaculty(Long facultyId) {
        return subjectRepository.findByFacultyId(facultyId);
    }
}