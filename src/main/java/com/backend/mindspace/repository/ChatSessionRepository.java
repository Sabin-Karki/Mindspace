package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUser_UserId(Long userId);
//    Optional<ChatSession> findByUserIdAndSourceId(Long userId, Long sourceId);
}
