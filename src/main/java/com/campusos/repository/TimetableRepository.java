package com.campusos.repository;

import com.campusos.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {

    List<Timetable> findByCourseIdAndSemesterOrderByDayOfWeekAscStartTimeAsc(Long courseId, int semester);

    List<Timetable> findByCourseIdAndSemesterAndDayOfWeekOrderByStartTimeAsc(Long courseId, int semester, DayOfWeek dayOfWeek);

    List<Timetable> findByFacultyIdOrderByDayOfWeekAscStartTimeAsc(Long facultyId);
}