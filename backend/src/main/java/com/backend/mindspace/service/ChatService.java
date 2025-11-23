package com.backend.mindspace.service;

import com.backend.mindspace.dto.ChatMessageDTO;
import com.backend.mindspace.dto.ChatResponse;
import com.backend.mindspace.dto.ChatSessionGetDTO;
import com.backend.mindspace.entity.*;
import com.backend.mindspace.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final GeminiService geminiService;
    private final ChunkRepository chunkRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SourceRepository sourceRepository;

    public ChatService(GeminiService geminiService,
                       ChunkRepository chunkRepository,
                       ChatSessionRepository chatSessionRepository,
                       ChatMessageRepository chatMessageRepository,
                       SourceRepository sourceRepository) {
        this.geminiService = geminiService;
        this.chunkRepository = chunkRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.sourceRepository = sourceRepository;
    }

    public ChatResponse askQuestion(User user, String question, Long sessionId) {
        System.out.println("=== START askQuestion ===");

        // Find the chat session and verify it belongs to the user
        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("ChatSession not found with id: " + sessionId));
        System.out.println("Found chat session: " + sessionId);

        if (!chatSession.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("User does not have access to this chat session");
        }

        //  Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setMessage(question);
        userMsg.setRole("user");
        userMsg.setChatSession(chatSession);
        userMsg.setCreatedAt(LocalDate.now());
        chatMessageRepository.save(userMsg);
        System.out.println("Saved user message");

        //  Find all sources for the session and gather their chunks
        List<Source> sources = sourceRepository.findByChatSession_SessionId(sessionId);
        System.out.println("Found sources: " + sources.size());

        List<Chunk> allChunks = sources.stream()
                .flatMap(source -> chunkRepository.findAllBySource_SourceId(source.getSourceId()).stream())
                .collect(Collectors.toList());
        System.out.println("Found chunks: " + allChunks.size());

        String answer;

        //  If no chunks, answer without RAG context
        if (allChunks.isEmpty()) {
            System.out.println("No chunks, asking directly");
            String prompt = "Answer this question directly: %s".formatted(question);
            answer = geminiService.callGeminiTextApi(prompt);
        } else {
            System.out.println("Generating embedding for question");
            //  Compute embeddings and find the most relevant chunks
            float[] questionEmbedding = geminiService.generateEmbedding(question);
            System.out.println("Got embedding, length: " + questionEmbedding.length);

            allChunks.sort((a, b) -> Float.compare(
                    cosineSimilarity(b.getEmbedding(), questionEmbedding),
                    cosineSimilarity(a.getEmbedding(), questionEmbedding)
            ));
            System.out.println("Sorted chunks by similarity");

            List<Chunk> topChunks = allChunks.stream().limit(3).toList();
            System.out.println("Selected top " + topChunks.size() + " chunks");

            StringBuilder context = new StringBuilder();
            for (Chunk c : topChunks) {
                context.append(c.getChunkText()).append("\n\n");
            }

            String prompt = """
                Use the following context to answer the user's question clearly and accurately.

                Context:
                %s

                Question: %s
                """.formatted(context, question);

            System.out.println("Calling Gemini with RAG context");
            // Get answer from Gemini
            answer = geminiService.callGeminiTextApi(prompt);
        }

        System.out.println("Got answer from Gemini");

        //  Save assistant message
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setMessage(answer);
        assistantMsg.setRole("assistant");
        assistantMsg.setChatSession(chatSession);
        assistantMsg.setCreatedAt(LocalDate.now());
        chatMessageRepository.save(assistantMsg);
        System.out.println("Saved assistant message");

        // Return response
        System.out.println("=== END askQuestion ===");
        return new ChatResponse(question, answer);
    }


    @Transactional
    public List<ChatMessageDTO> getChatHistory(Long sessionId, Long userId) {
        // Verify chat session belongs to the user
        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("ChatSession not found with id: " + sessionId));

        if (!chatSession.getUser().getUserId().equals(userId)) {
            throw new SecurityException("User does not have access to this chat session");
        }

        List<ChatMessage> messages = chatMessageRepository.findByChatSession_SessionIdAndChatSession_User_UserId(sessionId, userId);

        return messages.stream()
                .map(msg -> new ChatMessageDTO(msg.getMessage(), msg.getRole(), msg.getCreatedAt()))
                .toList();
    }

    @Transactional
    public List<ChatSessionGetDTO> getChatSessionById(Long userId){
        List<ChatSession> chatSession = chatSessionRepository.findByUser_UserId(userId);
        return  chatSession.stream()
                .map(session-> new ChatSessionGetDTO(session.getSessionId(),session.getCreatedAt(), session.getTitle()))
                .toList();
    }

    public void deleteChatSession(Long sessionId){
        if(!chatSessionRepository.existsById(sessionId)){
            throw new RuntimeException("Chat session not found with id: " + sessionId);
        }
        chatSessionRepository.deleteById(sessionId);
    }

    private float cosineSimilarity(float[] v1, float[] v2) {
        float dot = 0, normA = 0, normB = 0;

        for (int i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
            normA += v1[i] * v1[i];
            normB += v2[i] * v2[i];
        }

        return (float)(dot / (Math.sqrt(normA) * Math.sqrt(normB)));
    }
}