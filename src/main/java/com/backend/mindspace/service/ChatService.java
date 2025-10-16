package com.backend.mindspace.service;

import com.backend.mindspace.dto.ChatResponse;
import com.backend.mindspace.entity.Chunk;
import com.backend.mindspace.repository.ChunkRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ChatService {
  private  final GeminiService geminiService;
  private final ChunkRepository chunkRepository;

    public ChatService(GeminiService geminiService, ChunkRepository chunkRepository) {
        this.geminiService = geminiService;
        this.chunkRepository = chunkRepository;
    }

     public ChatResponse askQuestion(String question,Long sourceId){
        //get the embedding for question
         float[] questionEmbedding = geminiService.generateEmbedding(question);
         //retrieving all chunks_text for that source id
         List<Chunk> chunks = chunkRepository.findBySourceId(sourceId);
         //basically in my opinion now this lsit containts all chunk_text of the type Chunk or the Chunk object ofocurse //basically of the passed sourceID to the method every chunk object is retrieved and stored in List

         // 3️⃣ Compute cosine similarity
         chunks.sort((a, b) -> Float.compare(
                 cosineSimilarity(b.getEmbedding(), questionEmbedding),
                 cosineSimilarity(a.getEmbedding(), questionEmbedding)
         ));

         // 4️⃣ Pick top 3 most similar chunks
         List<Chunk> topChunks = chunks.stream().limit(3).toList();

         // 5️⃣ Construct context for Gemini
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

         // 6️⃣ Ask Gemini for the final answer
         String answer = geminiService.callGeminiTextApi(prompt);

         return new ChatResponse(question, answer);
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




