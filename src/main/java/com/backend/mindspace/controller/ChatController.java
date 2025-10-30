package com.backend.mindspace.controller;


import com.backend.mindspace.dto.ChatMessageDTO;
import com.backend.mindspace.dto.ChatRequest;
import com.backend.mindspace.dto.ChatResponse;
import com.backend.mindspace.entity.ChatSession;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.ChatSessionRepository;
import com.backend.mindspace.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {


    private final ChatService chatService;
    private final ChatSessionRepository chatSessionRepository;


    public ChatController(ChatService chatService, ChatSessionRepository chatSessionRepository) {
        this.chatService = chatService;
        this.chatSessionRepository = chatSessionRepository;
    }

    @PostMapping
    public ResponseEntity<ChatSession> createChatSession(@AuthenticationPrincipal User user) {
        ChatSession newSession = new ChatSession();
        newSession.setUser(user);
        newSession.setCreatedAt(LocalDate.now());
        ChatSession savedSession = chatSessionRepository.save(newSession);
        return ResponseEntity.ok(savedSession);
    }

    @PostMapping("/{sessionId}/ask")
    public  ResponseEntity<ChatResponse> askQuestion(@AuthenticationPrincipal User user, @PathVariable Long sessionId, @RequestBody ChatRequest chatRequest){
        ChatResponse response = chatService.askQuestion(user, chatRequest.getQuestion(), sessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@AuthenticationPrincipal User user, @PathVariable Long sessionId) {
        List<ChatMessageDTO> chatHistory = chatService.getChatHistory(sessionId, user);
        return ResponseEntity.ok(chatHistory);
    }
}
