package com.campusos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank
    @Column(name = "job_role", nullable = false, length = 100)
    private String role;

    @Column(length = 100)
    private String location;

    @Column(name = "ctc_or_stipend", length = 100)
    private String ctcOrStipend;

    @DecimalMin("0.0")
    @Column(name = "min_percentage_criteria", nullable = false)
    private double minPercentageCriteria;

    @NotNull
    @Column(name = "deadline_date", nullable = false)
    private LocalDate deadlineDate;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public JobPosting() {
    }

    public JobPosting(String title, Company company, String description, String role,
                      String location, String ctcOrStipend, double minPercentageCriteria, LocalDate deadlineDate) {
        this.title = title;
        this.company = company;
        this.description = description;
        this.role = role;
        this.location = location;
        this.ctcOrStipend = ctcOrStipend;
        this.minPercentageCriteria = minPercentageCriteria;
        this.deadlineDate = deadlineDate;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}