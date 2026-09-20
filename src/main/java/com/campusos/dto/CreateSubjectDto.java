package com.campusos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateSubjectDto {

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Subject code is required (e.g. CS101)")
    private String code;

    @Min(value = 1, message = "Credits must be at least 1")
    private int credits;

    @Min(value = 1, message = "Semester must be at least 1")
    private int semester;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    public CreateSubjectDto() {
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

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}