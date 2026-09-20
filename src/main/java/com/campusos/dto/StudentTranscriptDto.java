package com.campusos.dto;

import com.campusos.model.Marks;
import java.util.List;

public class StudentTranscriptDto {
    private Long studentId;
    private Double overallPercentage;
    private List<Marks> marksList;

    public StudentTranscriptDto() {}

    public StudentTranscriptDto(Long studentId, Double overallPercentage, List<Marks> marksList) {
        this.studentId = studentId;
        this.overallPercentage = overallPercentage;
        this.marksList = marksList;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(Double overallPercentage) { this.overallPercentage = overallPercentage; }

    public List<Marks> getMarksList() { return marksList; }
    public void setMarksList(List<Marks> marksList) { this.marksList = marksList; }
}