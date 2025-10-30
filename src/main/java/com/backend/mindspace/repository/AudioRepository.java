package com.backend.mindspace.repository;

import com.backend.mindspace.entity.AudioOverview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AudioRepository extends JpaRepository<AudioOverview,Long> {
    List<AudioOverview> findBySource_ChatSession_SessionIdAndSource_User_UserId(Long sessionId, Long userId);
}
