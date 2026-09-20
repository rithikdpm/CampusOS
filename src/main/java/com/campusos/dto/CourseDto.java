package com.campusos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseDto {

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Course code is required (e.g. BTECH-CSE)")
    private String code;

    @Min(value = 1, message = "Total semesters must be at least 1")
    private int totalSemesters;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    public CourseDto() {
    }

    public CourseDto(String name, String code, int totalSemesters, Long departmentId) {
        this.name = name;
        this.code = code;
        this.totalSemesters = totalSemesters;
        this.departmentId = departmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getTotalSemesters() {
        return totalSemesters;
    }

    public void setTotalSemesters(int totalSemesters) {
        this.totalSemesters = totalSemesters;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}