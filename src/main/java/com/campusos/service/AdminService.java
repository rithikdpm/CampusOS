package com.campusos.service;

import com.campusos.dto.AdminDashboardStatsDto;
import com.campusos.model.ApplicationStatus;
import com.campusos.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public AdminService(UserRepository userRepository,
                        StudentRepository studentRepository,
                        FacultyRepository facultyRepository,
                        DepartmentRepository departmentRepository,
                        CourseRepository courseRepository,
                        SubjectRepository subjectRepository,
                        JobPostingRepository jobPostingRepository,
                        JobApplicationRepository jobApplicationRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalStudents = studentRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalCourses = courseRepository.count();
        long totalSubjects = subjectRepository.count();
        long totalActiveJobs = jobPostingRepository.findByActiveTrueOrderByDeadlineDateAsc().size();
        long totalApplications = jobApplicationRepository.count();
        long totalSelected = jobApplicationRepository.countByStatus(ApplicationStatus.SELECTED);

        double placementRate = totalStudents == 0 ? 0.0 
                : Math.round(((double) totalSelected / totalStudents) * 10000.0) / 100.0;

        return new AdminDashboardStatsDto(
                totalUsers,
                totalStudents,
                totalFaculty,
                totalDepartments,
                totalCourses,
                totalSubjects,
                totalActiveJobs,
                totalApplications,
                totalSelected,
                placementRate
        );
    }
}