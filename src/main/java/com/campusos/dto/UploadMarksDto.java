package com.campusos.dto;

import jakarta.validation.constraints.NotNull;

public class UploadMarksDto {
    @NotNull private Long studentId;
    @NotNull private Long subjectId;
    @NotNull private String examType;
    @NotNull private Double marksObtained;
    @NotNull private Double maxMarks;
    private String comments;

    // Getters and Setters for all fields
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}