package com.campusos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateFacultyProfileDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotBlank(message = "Designation is required (e.g. Assistant Professor)")
    private String designation;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Joining date is required (YYYY-MM-DD)")
    private LocalDate joiningDate;

    private String phone;

    public CreateFacultyProfileDto() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}