package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession,Long> {
}
