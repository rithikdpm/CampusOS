package com.campusos.dto;

import jakarta.validation.constraints.NotNull;

public class AssignFacultyDto {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Faculty ID is required")
    private Long facultyId;

    public AssignFacultyDto() {
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }
}