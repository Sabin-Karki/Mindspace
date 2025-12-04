package com.backend.mindspace.service;

import com.backend.mindspace.dto.CardResponse;
import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.FlashCardOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.FlashCardOverviewRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashCardService {
    private final SourceRepository sourceRepository;
    private final GeminiService geminiService;
    private final FlashCardOverviewRepository flashCardOverviewRepository;
    private final ObjectMapper objectMapper;

    public FlashCardService(SourceRepository sourceRepository, GeminiService geminiService, FlashCardOverviewRepository flashCardOverviewRepository, ObjectMapper objectMapper) {
        this.sourceRepository = sourceRepository;
        this.geminiService = geminiService;
        this.flashCardOverviewRepository = flashCardOverviewRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public CardResponse generateAndSaveCards(Long sessionId, List<Long> sourceIds) {
        //so my argument will basically have the chatsession id and a list of selected sourceids
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        //first let me check that the sourceids and sessionid belong to the user as for authentication
        List<Source> selectedSources = sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId, currentUserId, sourceIds)
                .orElseThrow(() -> new RuntimeException("No sources found for the given session and user."));

        //so if the source table in db has id 1 has session id 2 and user id 3 and current user id and the passed session id matches and in same row,then it proceeds and returns the Source object
        //so now the source object has the content
        if (selectedSources.size() != sourceIds.size()) {
            throw new RuntimeException("Some sources not found for given session and user");
        }
        String combinedContent = selectedSources.stream()
                .map(Source::getContent)
                .collect(Collectors.joining("\n\n---\n\n"));
        System.out.println("Generating Title: ");
        String flashCardTitle = geminiService.generateTitle(combinedContent);
        System.out.println("Generating Cards: ");
        String cardJson = geminiService.generateFlashCard(combinedContent);
        try {
            List<FlashCard> flashCards = objectMapper.readValue(cardJson, new TypeReference<List<FlashCard>>() {});

            //parent overview
            FlashCardOverview flashCard = new FlashCardOverview();
            flashCard.setTitle(flashCardTitle);
            flashCard.setSources(selectedSources);
            flashCard.setCreatedAt(LocalDate.now());
            //now i need to associate each flashcard with my flashcard overview
            for (FlashCard card : flashCards) {
                card.setFlashCard(flashCard);
            }
            flashCard.setFlashCards(flashCards);
            flashCardOverviewRepository.save(flashCard);

            List<Long> selectedSourceIds = selectedSources.stream()
                    .map(Source::getSourceId)
                    .toList();
            // Return just the overview metadata (no cards in response)
            return new CardResponse(flashCard.getId(),flashCard.getTitle(),selectedSourceIds,null);

        } catch (IOException e) {
            e.printStackTrace();
            // Or handle it more gracefully
            throw new RuntimeException("Error parsing flashcards from AI service", e);
        }
    }

    // Get all Q&A cards for a specific overview
    public CardResponse getCardsByOverviewId(Long id) {
        FlashCardOverview overview = flashCardOverviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashCardOverview not found with id " + id));

        // Extract overview data once
        Long overviewId = overview.getId();
        String title = overview.getTitle();

        // so ,i will need to first transform and then store the transformed stream object of CardDetailResponse in a List called CardResponse.CardDetailResponse,after that,since i can return the actual CardResponse now that i will have the CardDetailResponse too
        List<CardResponse.CardDetailResponse> cardDetailResponseList = overview.getFlashCards().stream()
                .map(cards->new CardResponse.CardDetailResponse(cards.getId(),cards.getQuestion(),cards.getAnswer()))
                .collect(Collectors.toList());
        //the final .collect and its argument i am doing - > the easiest way to understand it as a final packager,which collects the object and wraps them in a list
        //now returning the actual CardResponse

        List<Long> sourceIds = overview.getSources().stream()
                .map(Source::getSourceId)
                .toList();
        return new CardResponse(overviewId,title,sourceIds,cardDetailResponseList);

    }

//     Get all Q&A cards for all overviews in a session
    public List<CardResponse> getCardsBySessionId(Long sessionId) {
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        System.out.println("Fetching for session " + sessionId + " user " + currentUserId);

        List<FlashCardOverview> overviews = flashCardOverviewRepository.findBySources_ChatSession_SessionIdAndSources_User_UserId(sessionId, currentUserId);
        System.out.println("Found " + overviews.size() + " results");
       //ts tuff..
        return overviews.stream().map(cardOverview->{
            List<CardResponse.CardDetailResponse> cardDetailResponseList = cardOverview.getFlashCards()
                    .stream()
                    .map(cards->new CardResponse.CardDetailResponse(cards.getId(),cards.getQuestion(),cards.getAnswer()))
                    .collect(Collectors.toList());

            List<Long> sourceIds = cardOverview.getSources().stream()
                    .map(Source::getSourceId)
                    .toList();

            return  new CardResponse(cardOverview.getId(), cardOverview.getTitle(),sourceIds,cardDetailResponseList);
        })
                        .collect(Collectors.toList());

    }

    //update title of the flashcard overview
    //first need to get the Flashcardoverview object
    @Transactional
    public CardResponse updateCardOverview(Long cardId,String newTitle){
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        FlashCardOverview existingFLashCardOverview = flashCardOverviewRepository.findById(cardId)
                .orElseThrow(()->new RuntimeException("CardOverview not found with id: " + cardId));
        
        existingFLashCardOverview.setTitle(newTitle);
        flashCardOverviewRepository.save(existingFLashCardOverview);
        List<Long> sourceIds = existingFLashCardOverview.getSources().stream()
                .map(Source::getSourceId)
                .toList();
        return new CardResponse(existingFLashCardOverview.getId(),existingFLashCardOverview.getTitle(),sourceIds,null);
    }

    public void deleteFlashCardOverview(Long cardId){
        if(!flashCardOverviewRepository.existsById(cardId)){
            throw new RuntimeException("CardOverview not found with id : " + cardId);
        }
        flashCardOverviewRepository.deleteById(cardId);
    }
}