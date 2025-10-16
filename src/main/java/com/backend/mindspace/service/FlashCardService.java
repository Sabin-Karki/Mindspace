package com.backend.mindspace.service;

import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.repository.FlashCardRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class FlashCardService{
    private final SourceRepository sourceRepository;
    private final GeminiService geminiService;
    private final FlashCardRepository flashCardRepository;
    private final ObjectMapper objectMapper;


    public FlashCardService(SourceRepository sourceRepository, GeminiService geminiService, FlashCardRepository flashCardRepository, ObjectMapper objectMapper) {
        this.sourceRepository = sourceRepository;
        this.geminiService = geminiService;
        this.flashCardRepository = flashCardRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public List<FlashCard> generateAndSaveCards(Long sourceId) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source not found with id : " + sourceId));

        String cardJson = geminiService.generateFlashCard(source.getContent());
        try{
            List<FlashCard> flashCards = objectMapper.readValue(cardJson, new TypeReference<List<FlashCard>>() {});
            flashCards.forEach(card -> card.setSource(source));
            return flashCardRepository.saveAll(flashCards);
        } catch (IOException e){
            e.printStackTrace();
            // Or handle it more gracefully
            throw new RuntimeException("Error parsing flashcards from AI service", e);
        }
    }
}