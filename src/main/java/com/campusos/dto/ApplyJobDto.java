package com.campusos.dto;

import jakarta.validation.constraints.NotNull;

public class ApplyJobDto {

    @NotNull(message = "Job posting ID is required")
    private Long jobPostingId;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    public ApplyJobDto() {
    }

    public Long getJobPostingId() {
        return jobPostingId;
    }

    public void setJobPostingId(Long jobPostingId) {
        this.jobPostingId = jobPostingId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}