package com.backend.mindspace.controller;


import com.backend.mindspace.dto.ChatRequest;
import com.backend.mindspace.dto.ChatResponse;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {


    private final ChatService chatService;


    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    private ResponseEntity<ChatResponse> askQuestion(@AuthenticationPrincipal User user ,@RequestBody ChatRequest chatRequest){
        ChatResponse response = chatService.askQuestion(user,chatRequest.getQuestion(),chatRequest.getSourceId());
        return ResponseEntity.ok(response);
    }
}