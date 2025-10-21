package com.backend.mindspace.service;

import com.backend.mindspace.dto.CardRequestDTO;
import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.FlashCardRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

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
    public List<FlashCard> generateAndSaveCards(Long sessionId, List<Long> sourceIds) {
        //so my argument will basically have the chatsession id and a list of selected sourceids
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        //first let me check that the sourceids and sessionid belong to the user as for authentication
       List<Source> selectedSources = sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId,currentUserId,sourceIds)
               .orElseThrow(()->new RuntimeException("No sources found for the given session and user."));

        //so if the source table in db has  id 1 has session id 2 and user id 3 and current user id and the passed session id matches and in same row,then it proceeds and returns the Source object
        //so now the source object has the content
        if(selectedSources.size()!=sourceIds.size()){
            throw new RuntimeException("Some sources not found for given session and user");
        }
        String combinedContent = selectedSources.stream()
                .map(Source::getContent)
                .collect(Collectors.joining("\n\n---\n\n"));

              String cardJson = geminiService.generateFlashCard(combinedContent);
        try{
            List<FlashCard> flashCards = objectMapper.readValue(cardJson, new TypeReference<List<FlashCard>>() {});
            if (selectedSources.size() == 1) {
                Source primarySource = selectedSources.getFirst();
                flashCards.forEach(card -> card.setSource(primarySource));
            } else {
                // If multiple sources are selected, set source to null to indicate aggregation
                flashCards.forEach(card -> card.setSource(null));
            }
            return flashCardRepository.saveAll(flashCards);
        } catch (IOException e){
            e.printStackTrace();
            // Or handle it more gracefully
            throw new RuntimeException("Error parsing flashcards from AI service", e);
        }
    }
}