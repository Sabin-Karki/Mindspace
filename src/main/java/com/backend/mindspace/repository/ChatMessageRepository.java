package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByChatSession_SessionIdAndChatSession_User_UserId(Long sessionId, Long userId);
}
