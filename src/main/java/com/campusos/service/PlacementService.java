package com.campusos.service;

import com.campusos.dto.*;
import com.campusos.model.*;
import com.campusos.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PlacementService {

    private final CompanyRepository companyRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final StudentRepository studentRepository;
    private final MarksService marksService;
    private final NotificationService notificationService;

    public PlacementService(CompanyRepository companyRepository,
                            JobPostingRepository jobPostingRepository,
                            JobApplicationRepository jobApplicationRepository,
                            StudentRepository studentRepository,
                            MarksService marksService,
                            NotificationService notificationService) {
        this.companyRepository = companyRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.studentRepository = studentRepository;
        this.marksService = marksService;
        this.notificationService = notificationService;
    }

    public Company createCompany(CreateCompanyDto dto) {
        if (companyRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Company with name " + dto.getName() + " already exists!");
        }
        Company company = new Company(dto.getName(), dto.getWebsite(), dto.getIndustry(), dto.getDescription());
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public JobPosting createJobPosting(CreateJobPostingDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + dto.getCompanyId()));

        JobPosting job = new JobPosting(
                dto.getTitle(),
                company,
                dto.getDescription(),
                dto.getRole(),
                dto.getLocation(),
                dto.getCtcOrStipend(),
                dto.getMinPercentageCriteria(),
                dto.getDeadlineDate()
        );

        return jobPostingRepository.save(job);
    }

    public List<JobPosting> getActiveJobPostings() {
        return jobPostingRepository.findByActiveTrueOrderByDeadlineDateAsc();
    }

    @Transactional
    public JobApplication applyForJob(ApplyJobDto dto) {
        JobPosting job = jobPostingRepository.findById(dto.getJobPostingId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + dto.getJobPostingId()));

        if (!job.isActive() || LocalDate.now().isAfter(job.getDeadlineDate())) {
            throw new IllegalArgumentException("This job posting is closed or deadline has passed.");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        if (jobApplicationRepository.findByJobPostingIdAndStudentId(job.getId(), student.getId()).isPresent()) {
            throw new IllegalArgumentException("Student has already applied for this job.");
        }

        StudentTranscriptDto transcript = marksService.getStudentTranscript(student.getId());
        if (transcript.getOverallPercentage() < job.getMinPercentageCriteria()) {
            throw new IllegalArgumentException("Ineligible: Required percentage is " 
                    + job.getMinPercentageCriteria() + "%, but current percentage is " 
                    + transcript.getOverallPercentage() + "%");
        }

        JobApplication application = new JobApplication(job, student, transcript.getOverallPercentage());
        JobApplication savedApplication = jobApplicationRepository.save(application);

        // Send confirmation notification
        notificationService.sendNotification(
                student.getUser().getId(),
                "Job Application Submitted",
                "You have successfully applied for " + job.getTitle() + " at " + job.getCompany().getName(),
                NotificationType.PLACEMENT_UPDATE
        );

        return savedApplication;
    }

    @Transactional
    public JobApplication updateApplicationStatus(UpdateApplicationStatusDto dto) {
        JobApplication application = jobApplicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + dto.getApplicationId()));

        application.setStatus(dto.getStatus());
        application.setFeedbackOrNotes(dto.getNotes());
        JobApplication updated = jobApplicationRepository.save(application);

        // Notify student about the status update
        notificationService.sendNotification(
                application.getStudent().getUser().getId(),
                "Placement Status Update: " + dto.getStatus(),
                "Your application for " + application.getJobPosting().getTitle() + " has been updated to: " + dto.getStatus(),
                NotificationType.PLACEMENT_UPDATE
        );

        return updated;
    }

    public List<JobApplication> getApplicationsForJob(Long jobPostingId) {
        return jobApplicationRepository.findByJobPostingId(jobPostingId);
    }

    public List<JobApplication> getApplicationsByStudent(Long studentId) {
        return jobApplicationRepository.findByStudentId(studentId);
    }
    
    public List<JobApplication> getStudentApplications(Long studentId) {
        return jobApplicationRepository.findByStudentId(studentId);
    }

    public List<JobPosting> getActiveJobs() {
        return jobPostingRepository.findAll();
    }
}