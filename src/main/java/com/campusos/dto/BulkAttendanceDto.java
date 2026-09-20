package com.campusos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BulkAttendanceDto {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Attendance date is required (YYYY-MM-DD)")
    private LocalDate attendanceDate;

    @NotEmpty(message = "Attendance list cannot be empty")
    @Valid
    private List<AttendanceEntryDto> entries;

    public BulkAttendanceDto() {
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public List<AttendanceEntryDto> getEntries() {
        return entries;
    }

    public void setEntries(List<AttendanceEntryDto> entries) {
        this.entries = entries;
    }
}