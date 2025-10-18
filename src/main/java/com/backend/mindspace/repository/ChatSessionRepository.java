package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findByUserIdAndSourceId(Long userId, Long sourceId);
}
