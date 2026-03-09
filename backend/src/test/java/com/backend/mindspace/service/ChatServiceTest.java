package com.backend.mindspace.service;

import com.backend.mindspace.dto.ChatMessageDTO;
import com.backend.mindspace.entity.ChatMessage;
import com.backend.mindspace.entity.ChatSession;
import com.backend.mindspace.entity.Chunk;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.ChatMessageRepository;
import com.backend.mindspace.repository.ChatSessionRepository;
import com.backend.mindspace.repository.ChunkRepository;
import com.backend.mindspace.repository.SourceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private GeminiService geminiService;

    @Mock
    private ChunkRepository chunkRepository;

    @Mock
    private ChatSessionRepository chatSessionRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private SourceRepository sourceRepository;

    @InjectMocks
    private ChatService chatService;

    @Test
    void askQuestionShouldReturnDirectAnswerWhenNoChunksExist() {
        User user = buildUser(1L);
        ChatSession session = buildSession(10L, user);

        when(chatSessionRepository.findById(10L)).thenReturn(Optional.of(session));
        when(sourceRepository.findByChatSession_SessionId(10L)).thenReturn(List.of());
        when(geminiService.callGeminiTextApi(anyString())).thenReturn("Direct answer");

        AtomicLong idGenerator = new AtomicLong(1L);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage msg = invocation.getArgument(0);
            msg.setMessageId(idGenerator.getAndIncrement());
            return msg;
        });

        ChatMessageDTO response = chatService.askQuestion(user, "What is JWT?", 10L);

        assertEquals("Direct answer", response.getMessage());
        assertEquals("assistant", response.getRole());
        assertNotNull(response.getMessageId());

        verify(geminiService, times(1)).callGeminiTextApi(anyString());
        verify(geminiService, never()).generateEmbedding(anyString());
        verify(geminiService, never()).callGeminiTextApiForAnswer(anyString());

        ArgumentCaptor<ChatMessage> messageCaptor = ArgumentCaptor.forClass(ChatMessage.class);
        verify(chatMessageRepository, times(2)).save(messageCaptor.capture());
        List<ChatMessage> savedMessages = messageCaptor.getAllValues();
        assertEquals("user", savedMessages.get(0).getRole());
        assertEquals("What is JWT?", savedMessages.get(0).getMessage());
        assertEquals("assistant", savedMessages.get(1).getRole());
        assertEquals("Direct answer", savedMessages.get(1).getMessage());
    }

    @Test
    void askQuestionShouldReturnContextualAnswerWhenChunksExist() {
        User user = buildUser(1L);
        ChatSession session = buildSession(20L, user);

        Source source = new Source();
        source.setSourceId(99L);

        Chunk chunk1 = new Chunk();
        chunk1.setChunkText("JWT uses signed tokens for authentication.");
        chunk1.setEmbedding(new float[]{1.0f, 0.0f, 0.0f});

        Chunk chunk2 = new Chunk();
        chunk2.setChunkText("Spring Security validates credentials before token issuance.");
        chunk2.setEmbedding(new float[]{0.8f, 0.2f, 0.0f});

        when(chatSessionRepository.findById(20L)).thenReturn(Optional.of(session));
        when(sourceRepository.findByChatSession_SessionId(20L)).thenReturn(List.of(source));
        when(chunkRepository.findAllBySource_SourceId(99L)).thenReturn(List.of(chunk1, chunk2));
        when(geminiService.generateEmbedding("How does JWT authentication work?"))
                .thenReturn(new float[]{1.0f, 0.0f, 0.0f});
        when(geminiService.callGeminiTextApiForAnswer(anyString())).thenReturn("Contextual answer");

        AtomicLong idGenerator = new AtomicLong(100L);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage msg = invocation.getArgument(0);
            msg.setMessageId(idGenerator.getAndIncrement());
            return msg;
        });

        ChatMessageDTO response = chatService.askQuestion(user, "How does JWT authentication work?", 20L);

        assertEquals("Contextual answer", response.getMessage());
        assertEquals("assistant", response.getRole());

        verify(geminiService, times(1)).generateEmbedding("How does JWT authentication work?");
        verify(geminiService, times(1)).callGeminiTextApiForAnswer(anyString());
        verify(geminiService, never()).callGeminiTextApi(anyString());
    }

    private User buildUser(Long userId) {
        User user = new User();
        user.setUserId(userId);
        user.setEmail("user@example.com");
        return user;
    }

    private ChatSession buildSession(Long sessionId, User user) {
        ChatSession session = new ChatSession();
        session.setSessionId(sessionId);
        session.setUser(user);
        session.setCreatedAt(LocalDate.now());
        return session;
    }
}
