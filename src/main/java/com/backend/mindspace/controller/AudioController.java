package com.backend.mindspace.controller;

import com.backend.mindspace.entity.AudioOverview;
import com.backend.mindspace.service.AudioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audio")
public class AudioController {

    private final AudioService audioService;

    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }

    @PostMapping("/generate/{sourceId}")
    public ResponseEntity<AudioOverview> generateAudioOverview(@PathVariable Long sourceId) {
        try {
            AudioOverview audioOverview = audioService.generateAudioOverview(sourceId);
            return ResponseEntity.ok(audioOverview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
