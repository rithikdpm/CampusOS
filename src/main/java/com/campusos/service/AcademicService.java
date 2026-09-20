package com.campusos.service;

import com.campusos.dto.CourseDto;
import com.campusos.dto.DepartmentDto;
import com.campusos.model.Course;
import com.campusos.model.Department;
import com.campusos.repository.CourseRepository;
import com.campusos.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicService {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;

    public AcademicService(DepartmentRepository departmentRepository, CourseRepository courseRepository) {
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
    }

    public Department createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Department with code " + dto.getCode() + " already exists!");
        }
        Department department = new Department(dto.getName(), dto.getCode(), dto.getDescription());
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Course createCourse(CourseDto dto) {
        if (courseRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Course with code " + dto.getCode() + " already exists!");
        }
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + dto.getDepartmentId()));

        Course course = new Course(dto.getName(), dto.getCode(), dto.getTotalSemesters(), department);
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}