package com.campusos.dto;

import jakarta.validation.constraints.NotBlank;

public class DepartmentDto {

    @NotBlank(message = "Department name is required")
    private String name;

    @NotBlank(message = "Department code is required (e.g. CSE, ECE)")
    private String code;

    private String description;

    public DepartmentDto() {
    }

    public DepartmentDto(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}