package com.campusos.dto;

import com.campusos.model.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public class ReviewLeaveDto {

    @NotNull(message = "Leave request ID is required")
    private Long leaveRequestId;

    @NotNull(message = "Reviewing Faculty ID is required")
    private Long facultyId;

    @NotNull(message = "Decision status is required (APPROVED or REJECTED)")
    private LeaveStatus status;

    private String reviewRemarks;

    public ReviewLeaveDto() {
    }

    public Long getLeaveRequestId() {
        return leaveRequestId;
    }

    public void setLeaveRequestId(Long leaveRequestId) {
        this.leaveRequestId = leaveRequestId;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }

    public String getReviewRemarks() {
        return reviewRemarks;
    }

    public void setReviewRemarks(String reviewRemarks) {
        this.reviewRemarks = reviewRemarks;
    }
}