package com.campusos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateStudentProfileDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @Min(value = 1, message = "Current semester must be 1 or greater")
    private int currentSemester;

    @NotNull(message = "Admission date is required (YYYY-MM-DD)")
    private LocalDate admissionDate;

    private String phone;

    public CreateStudentProfileDto() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getCurrentSemester() {
        return currentSemester;
    }

    public void setCurrentSemester(int currentSemester) {
        this.currentSemester = currentSemester;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}