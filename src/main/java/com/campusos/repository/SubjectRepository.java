package com.campusos.repository;

import com.campusos.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    boolean existsByCode(String code);
    List<Subject> findByFacultyId(Long facultyId);
    List<Subject> findByCourseIdAndSemester(Long courseId, int semester);
    List<Subject> findByCourseId(Long courseId);
}