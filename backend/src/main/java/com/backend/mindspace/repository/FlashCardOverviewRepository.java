package com.backend.mindspace.repository;

import com.backend.mindspace.entity.FlashCardOverview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashCardOverviewRepository extends JpaRepository<FlashCardOverview,Long> {

     List<FlashCardOverview> findBySources_ChatSession_SessionIdAndSources_User_UserId(Long sessionId, Long currentUserId);
}
