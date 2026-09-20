package com.campusos.dto;

import com.campusos.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicationStatusDto {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Status is required (APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, SELECTED)")
    private ApplicationStatus status;

    private String notes;

    public UpdateApplicationStatusDto() {
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}