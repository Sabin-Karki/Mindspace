package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ReportGeneration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportGeneration,Long> {

}
