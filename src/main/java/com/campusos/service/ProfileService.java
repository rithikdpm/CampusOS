package com.campusos.service;

import com.campusos.dto.CreateFacultyProfileDto;
import com.campusos.dto.CreateStudentProfileDto;
import com.campusos.model.*;
import com.campusos.repository.*;
import org.springframework.stereotype.Service;
import com.campusos.repository.SubjectRepository;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class ProfileService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;

    public ProfileService(
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            CourseRepository courseRepository,
            SubjectRepository subjectRepository) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    public Student createStudentProfile(CreateStudentProfileDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + dto.getUserId()));

        if (user.getRole() != Role.ROLE_STUDENT) {
            throw new IllegalArgumentException("Assigned user must have ROLE_STUDENT to create a student profile.");
        }
        if (studentRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("Student profile already exists for user ID: " + dto.getUserId());
        }
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new IllegalArgumentException("Roll number " + dto.getRollNumber() + " is already taken.");
        }

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + dto.getCourseId()));

        Student student = new Student(user, dto.getRollNumber(), course, dto.getCurrentSemester(), dto.getAdmissionDate(), dto.getPhone());
        return studentRepository.save(student);
    }

    public Faculty createFacultyProfile(CreateFacultyProfileDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + dto.getUserId()));

        if (user.getRole() != Role.ROLE_FACULTY) {
            throw new IllegalArgumentException("Assigned user must have ROLE_FACULTY to create a faculty profile.");
        }
        if (facultyRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("Faculty profile already exists for user ID: " + dto.getUserId());
        }
        if (facultyRepository.existsByEmployeeCode(dto.getEmployeeCode())) {
            throw new IllegalArgumentException("Employee code " + dto.getEmployeeCode() + " is already registered.");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + dto.getDepartmentId()));

        Faculty faculty = new Faculty(user, dto.getEmployeeCode(), dto.getDesignation(), department, dto.getJoiningDate(), dto.getPhone());
        return facultyRepository.save(faculty);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }
    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user ID: " + userId));
    }

    public Faculty getFacultyByUserId(Long userId) {
        return facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found for user ID: " + userId));
    }
    @Transactional
    public void deleteFaculty(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found with ID: " + facultyId));

        // 1. Unlink from assigned subjects
        List<Subject> assignedSubjects = subjectRepository.findByFacultyId(facultyId);
        for (Subject s : assignedSubjects) {
            s.setFaculty(null);
            subjectRepository.save(s);
        }

        Long userId = faculty.getUser().getId();

        // 2. Delete the faculty profile
        facultyRepository.delete(faculty);

        // 3. Delete the base user account
        userRepository.deleteById(userId);
    }
}
