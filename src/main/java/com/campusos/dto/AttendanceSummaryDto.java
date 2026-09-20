package com.campusos.dto;

public class AttendanceSummaryDto {

    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private long totalClasses;
    private long attendedClasses;
    private double attendancePercentage;

    public AttendanceSummaryDto() {
    }

    public AttendanceSummaryDto(Long subjectId, String subjectName, String subjectCode, long totalClasses, long attendedClasses, double attendancePercentage) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.attendancePercentage = attendancePercentage;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public long getAttendedClasses() {
        return attendedClasses;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }
}