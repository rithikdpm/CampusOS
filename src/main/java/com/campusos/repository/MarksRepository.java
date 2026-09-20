package com.campusos.repository;

import com.campusos.model.ExamType;
import com.campusos.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    List<Marks> findBySubjectId(Long subjectId);

    List<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    Optional<Marks> findByStudentIdAndSubjectIdAndExamType(Long studentId, Long subjectId, ExamType examType);
}