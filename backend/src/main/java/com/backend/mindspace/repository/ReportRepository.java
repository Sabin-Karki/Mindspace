package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ReportGeneration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<ReportGeneration,Long> {

   List<ReportGeneration> findBySource_ChatSession_SessionIdAndSource_User_UserId(Long sessionId, Long currentUserId);
}
