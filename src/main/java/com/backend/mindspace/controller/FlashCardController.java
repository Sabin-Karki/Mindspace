package com.backend.mindspace.controller;

import com.backend.mindspace.dto.CardRequestDTO;
import com.backend.mindspace.dto.CardResponse;
import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.FlashCardOverview;
import com.backend.mindspace.service.FlashCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            CardResponse cardOverview = flashCardService.getCardOverviewById(id);
            return ResponseEntity.ok(cardOverview);
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/flash-card/session/{sessionId}")
    private ResponseEntity <List<CardResponse>> getFlashCardOverviewBySessionid(@PathVariable(name = "sessionId") Long id) {
        try {
            List<CardResponse> cardOverview = flashCardService.getCardOverviewBySessionId(id);
            return ResponseEntity.ok(cardOverview);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



}