package com.campusos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateJobPostingDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Job role is required (e.g. Full Stack Developer)")
    private String role;

    private String location;
    private String ctcOrStipend;

    @DecimalMin(value = "0.0", message = "Minimum percentage criteria cannot be negative")
    private double minPercentageCriteria;

    @NotNull(message = "Deadline date is required (YYYY-MM-DD)")
    @FutureOrPresent(message = "Deadline cannot be in the past")
    private LocalDate deadlineDate;

    public CreateJobPostingDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCtcOrStipend() {
        return ctcOrStipend;
    }

    public void setCtcOrStipend(String ctcOrStipend) {
        this.ctcOrStipend = ctcOrStipend;
    }

    public double getMinPercentageCriteria() {
        return minPercentageCriteria;
    }

    public void setMinPercentageCriteria(double minPercentageCriteria) {
        this.minPercentageCriteria = minPercentageCriteria;
    }

    public LocalDate getDeadlineDate() {
        return deadlineDate;
    }

    public void setDeadlineDate(LocalDate deadlineDate) {
        this.deadlineDate = deadlineDate;
    }
}