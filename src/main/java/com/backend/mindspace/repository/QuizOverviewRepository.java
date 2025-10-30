package com.backend.mindspace.repository;

import com.backend.mindspace.entity.QuizOverview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizOverviewRepository extends JpaRepository<QuizOverview, Long> {
    List<QuizOverview> findBySource_ChatSession_SessionIdAndSource_User_UserId(Long sessionId, Long userId);
}
