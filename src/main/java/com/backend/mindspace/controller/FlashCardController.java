package com.backend.mindspace.controller;

import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.service.FlashCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/generate")
public class FlashCardController {
    private final FlashCardService flashCardService;

    public FlashCardController(FlashCardService flashCardService) {
        this.flashCardService = flashCardService;
    }

    @PostMapping("/flash-card/{sourceId}")
    private ResponseEntity<List<FlashCard>> generateFlashCard(@PathVariable(name = "sourceId") Long sourceId) {
        try {
            List<FlashCard> cards = flashCardService.generateAndSaveCards(sourceId);
            return ResponseEntity.ok(cards);
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}