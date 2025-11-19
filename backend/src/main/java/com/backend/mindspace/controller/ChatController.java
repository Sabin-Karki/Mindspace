package com.backend.mindspace.controller;


import com.backend.mindspace.dto.ChatMessageDTO;
import com.backend.mindspace.dto.ChatRequest;
import com.backend.mindspace.dto.ChatResponse;
import com.backend.mindspace.dto.ChatSessionGetDTO;
import com.backend.mindspace.dto.ChatTitleRenameRequest;
import com.backend.mindspace.entity.ChatSession;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.ChatSessionRepository;
import com.backend.mindspace.service.ChatService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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
    	try{    		
    		ChatSession newSession = new ChatSession();
    		newSession.setUser(user);
    		newSession.setCreatedAt(LocalDate.now());
    		newSession.setTitle("Untitled Notebook");
    		ChatSession savedSession = chatSessionRepository.save(newSession);
    		return ResponseEntity.ok(savedSession);
    	}catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/getAll")
    public ResponseEntity<List<ChatSessionGetDTO>> getChatSessionByUserId(@AuthenticationPrincipal User user){
        try{
          List  <ChatSessionGetDTO> session = chatService.getChatSessionById(user.getUserId());
            return ResponseEntity.ok(session);
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{sessionId}/ask")
    public  ResponseEntity<ChatResponse> askQuestion(@AuthenticationPrincipal User user, @PathVariable Long sessionId, @RequestBody ChatRequest chatRequest){
        ChatResponse response = chatService.askQuestion(user, chatRequest.getQuestion(), sessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@AuthenticationPrincipal User user, @PathVariable Long sessionId) {
     
		List<ChatMessageDTO> chatHistory = chatService.getChatHistory(sessionId, user.getUserId());
		return ResponseEntity.ok(chatHistory);
    }

    @PatchMapping("session/{sessionId}")
    public ResponseEntity<ChatSession> renameChatTitle (@AuthenticationPrincipal User user,
    		@PathVariable Long sessionId,
    		@RequestBody ChatTitleRenameRequest renameRequest) {
    	try{    		
    		System.out.println(sessionId);
    		ChatSession existingChatSession = chatSessionRepository.findById(sessionId)
    				.orElseThrow(() -> new EntityNotFoundException("ChatSession not found with id: " + sessionId));

    		if(existingChatSession.getTitle().equals(renameRequest.getTitle()) ) {
    			return ResponseEntity.ok(existingChatSession);
    		}
    		
    		//update title
    		existingChatSession.setTitle(renameRequest.getTitle());
    		
    		ChatSession savedSession = chatSessionRepository.save(existingChatSession);
    		return ResponseEntity.ok(savedSession);
    	}catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteChatSession(@PathVariable Long sessionId){
	   try {
		   System.out.println(sessionId);
	       chatService.deleteChatSession(sessionId);
	       return ResponseEntity.noContent().build();
	   }catch (RuntimeException e){
	       return ResponseEntity.notFound().build();
	   }
    }
}