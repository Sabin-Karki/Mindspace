package com.backend.mindspace.controller;

import com.backend.mindspace.dto.CardRequestDTO;
import com.backend.mindspace.dto.CardResponse;
import com.backend.mindspace.dto.CardUpdate;
import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.FlashCardOverview;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.FlashCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/generate")
public class FlashCardController {
    private final FlashCardService flashCardService;

    public FlashCardController(FlashCardService flashCardService) {
        this.flashCardService = flashCardService;
    }

    @PostMapping("/flash-card/{sessionId}")
    private ResponseEntity<CardResponse> generateFlashCard(@PathVariable(name = "sessionId") Long sessionId, @RequestBody CardRequestDTO cardRequestDTO) {
        try {
            CardResponse cards = flashCardService.generateAndSaveCards(sessionId,cardRequestDTO.getSourceIds());
            return ResponseEntity.ok(cards);
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/flash-card/{cardId}")
    private ResponseEntity<CardResponse> getFlashCardOverviewById(@PathVariable(name = "cardId") Long id){
        try{
            CardResponse cardOverview = flashCardService.getCardsByOverviewId(id);
            return ResponseEntity.ok(cardOverview);
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/flash-card/session/{sessionId}")
    public ResponseEntity <List<CardResponse>> getFlashCardOverviewBySessionid(@PathVariable(name = "sessionId") Long id) {
        try {
            List<CardResponse> cardOverview = flashCardService.getCardsBySessionId(id);
            return ResponseEntity.ok(cardOverview);
        }catch (RuntimeException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/flash-card/{cardId}")
    public ResponseEntity<CardResponse> updateFlashCardOverviewTitle(@PathVariable Long cardId, @RequestBody CardUpdate cardUpdate){
        try{
        CardResponse updatedCard = flashCardService.updateCardOverview(cardId,cardUpdate.getTitle());
        return ResponseEntity.ok(updatedCard);
    }catch (RuntimeException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/flash-card/{cardId}")
    public ResponseEntity<Void> deleteFlashCardOverview(@PathVariable Long cardId){
        try{
            flashCardService.deleteFlashCardOverview(cardId);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}