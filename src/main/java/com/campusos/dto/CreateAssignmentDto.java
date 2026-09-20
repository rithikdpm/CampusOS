package com.campusos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateAssignmentDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Due date is required (YYYY-MM-DDTHH:MM:SS)")
    private LocalDateTime dueDate;

    @DecimalMin(value = "1.0", message = "Max marks must be at least 1.0")
    private double maxMarks;

    public CreateAssignmentDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public double getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(double maxMarks) {
        this.maxMarks = maxMarks;
    }
}