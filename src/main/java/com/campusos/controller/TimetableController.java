package com.campusos.controller;

import com.campusos.dto.CreateTimetableEntryDto;
import com.campusos.model.Timetable;
import com.campusos.service.TimetableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Timetable> scheduleTimetable(@Valid @RequestBody CreateTimetableEntryDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(timetableService.createTimetableEntry(dto));
    }

    @GetMapping("/course/{courseId}/semester/{semester}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT', 'ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<List<Timetable>> getTimetable(
            @PathVariable("courseId") Long courseId,
            @PathVariable("semester") Integer semester) {
        return ResponseEntity.ok(timetableService.getCourseSchedule(courseId, semester));
    }
}