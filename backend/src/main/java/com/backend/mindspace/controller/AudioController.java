package com.backend.mindspace.controller;

import com.backend.mindspace.dto.AudioResponseDTO;
import com.backend.mindspace.dto.AudioUpdateDTO;
import com.backend.mindspace.entity.AudioOverview;
import com.backend.mindspace.service.AudioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/audio")
public class AudioController {

    private final AudioService audioService;

    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }

    @PostMapping("/generate/{sourceId}")
    public ResponseEntity<AudioResponseDTO> generateAudioOverview(@PathVariable Long sourceId) {
        try {
            AudioOverview audioOverview = audioService.generateAudioOverview(sourceId);
            AudioResponseDTO responseDTO = new AudioResponseDTO(
                    audioOverview.getId(),
                    audioOverview.getTitle(),
                    audioOverview.getCreatedAt(),
                    audioOverview.getAudioUrl());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AudioResponseDTO>> getAudioOverviewsBySessionId(@PathVariable Long sessionId) {
        List<AudioOverview> audioOverviews = audioService.getAudioOverviewsBySessionId(sessionId);
        List<AudioResponseDTO> responseDTOs = audioOverviews.stream()
                .map(ao -> new AudioResponseDTO(ao.getId(), ao.getTitle(), ao.getCreatedAt(), ao.getAudioUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/{audioId}")
    public ResponseEntity<AudioResponseDTO> getAudioOverviewById(@PathVariable Long audioId) {
        try {
            AudioOverview audioOverview = audioService.getAudioOverviewById(audioId);
            AudioResponseDTO responseDTO = new AudioResponseDTO(
                    audioOverview.getId(),
                    audioOverview.getTitle(),
                    audioOverview.getCreatedAt(),
                    audioOverview.getAudioUrl());
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{audioId}")
    public ResponseEntity<AudioResponseDTO> updateAudioTitle(@PathVariable Long audioId, @RequestBody AudioUpdateDTO audioUpdateDTO) {
        try {
            AudioOverview updatedAudioOverview = audioService.updateAudioTitle(audioId, audioUpdateDTO.getTitle());
            AudioResponseDTO responseDTO = new AudioResponseDTO(
                    updatedAudioOverview.getId(),
                    updatedAudioOverview.getTitle(),
                    updatedAudioOverview.getCreatedAt(),
                    updatedAudioOverview.getAudioUrl());
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{audioId}")
    public ResponseEntity<Void> deleteAudioOverview(@PathVariable Long audioId){
        try{
            audioService.deleteAudioOverview(audioId);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
