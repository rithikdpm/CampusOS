package com.campusos.dto;

public class AdminDashboardStatsDto {

    private long totalUsers;
    private long totalStudents;
    private long totalFaculty;
    private long totalDepartments;
    private long totalCourses;
    private long totalSubjects;
    private long totalActiveJobs;
    private long totalJobApplications;
    private long totalSelectedStudents;
    private double overallPlacementRate;

    public AdminDashboardStatsDto() {
    }

    public AdminDashboardStatsDto(long totalUsers, long totalStudents, long totalFaculty,
                                  long totalDepartments, long totalCourses, long totalSubjects,
                                  long totalActiveJobs, long totalJobApplications,
                                  long totalSelectedStudents, double overallPlacementRate) {
        this.totalUsers = totalUsers;
        this.totalStudents = totalStudents;
        this.totalFaculty = totalFaculty;
        this.totalDepartments = totalDepartments;
        this.totalCourses = totalCourses;
        this.totalSubjects = totalSubjects;
        this.totalActiveJobs = totalActiveJobs;
        this.totalJobApplications = totalJobApplications;
        this.totalSelectedStudents = totalSelectedStudents;
        this.overallPlacementRate = overallPlacementRate;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getTotalFaculty() {
        return totalFaculty;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public long getTotalSubjects() {
        return totalSubjects;
    }

    public long getTotalActiveJobs() {
        return totalActiveJobs;
    }

    public long getTotalJobApplications() {
        return totalJobApplications;
    }

    public long getTotalSelectedStudents() {
        return totalSelectedStudents;
    }

    public double getOverallPlacementRate() {
        return overallPlacementRate;
    }
}