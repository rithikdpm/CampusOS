package com.campusos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class GradeSubmissionDto {

    @NotNull(message = "Submission ID is required")
    private Long submissionId;

    @NotNull(message = "Marks awarded is required")
    @DecimalMin(value = "0.0", message = "Marks cannot be negative")
    private Double marksAwarded;

    private String facultyFeedback;

    public GradeSubmissionDto() {
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Double getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(Double marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public String getFacultyFeedback() {
        return facultyFeedback;
    }

    public void setFacultyFeedback(String facultyFeedback) {
        this.facultyFeedback = facultyFeedback;
    }
}