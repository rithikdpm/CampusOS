package com.campusos.service;

import com.campusos.dto.CreateTimetableEntryDto;
import com.campusos.model.*;
import com.campusos.repository.CourseRepository;
import com.campusos.repository.FacultyRepository;
import com.campusos.repository.SubjectRepository;
import com.campusos.repository.TimetableRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;

    public TimetableService(TimetableRepository timetableRepository,
                            CourseRepository courseRepository,
                            SubjectRepository subjectRepository,
                            FacultyRepository facultyRepository) {
        this.timetableRepository = timetableRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.facultyRepository = facultyRepository;
    }

    public Timetable createTimetableEntry(CreateTimetableEntryDto dto) {
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + dto.getCourseId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + dto.getSubjectId()));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found with ID: " + dto.getFacultyId()));

        Timetable entry = new Timetable(
                course,
                dto.getSemester(),
                subject,
                faculty,
                dto.getDayOfWeek(),
                dto.getStartTime(),
                dto.getEndTime(),
                dto.getRoomNumber()
        );

        return timetableRepository.save(entry);
    }

    public List<Timetable> getCourseSchedule(Long courseId, int semester) {
        return timetableRepository.findByCourseIdAndSemesterOrderByDayOfWeekAscStartTimeAsc(courseId, semester);
    }

    public List<Timetable> getCourseScheduleForDay(Long courseId, int semester, DayOfWeek dayOfWeek) {
        return timetableRepository.findByCourseIdAndSemesterAndDayOfWeekOrderByStartTimeAsc(courseId, semester, dayOfWeek);
    }

    public List<Timetable> getFacultySchedule(Long facultyId) {
        return timetableRepository.findByFacultyIdOrderByDayOfWeekAscStartTimeAsc(facultyId);
    }
}