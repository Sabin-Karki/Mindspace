package com.backend.mindspace.repository;

import com.backend.mindspace.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    @Query("SELECT m FROM ChatMessage m JOIN FETCH m.chatSession cs WHERE cs.sessionId = :sessionId AND cs.user.userId = :userId ORDER BY m.createdAt ASC")
    List<ChatMessage> findByChatSession_SessionIdAndChatSession_User_UserId(
            @Param("sessionId") Long sessionId,
            @Param("userId") Long userId
    );
}

//join fetch is a  jpql used to override lazy fetch issues,lazy loading is an occurance of loading  fields when the getter is called