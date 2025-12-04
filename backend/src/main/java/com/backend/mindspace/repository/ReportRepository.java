package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ReportGeneration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<ReportGeneration,Long> {

   List<ReportGeneration> findBySources_ChatSession_SessionIdAndSources_User_UserId(Long sessionId, Long currentUserId);
}
