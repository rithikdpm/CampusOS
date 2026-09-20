package com.campusos.repository;

import com.campusos.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmployeeCode(String employeeCode);
    boolean existsByEmployeeCode(String employeeCode);
    Optional<Faculty> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}