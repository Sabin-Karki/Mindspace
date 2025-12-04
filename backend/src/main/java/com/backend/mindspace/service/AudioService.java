package com.backend.mindspace.service;

import com.backend.mindspace.entity.AudioOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.AudioRepository;
import com.backend.mindspace.repository.SourceRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AudioService {

    private final GeminiService geminiService;
    private final SourceRepository sourceRepository;
    private final AudioRepository audioRepository;
    private final Path audioStoragePath = Paths.get("src/main/resources/static/audio");

    public AudioService(GeminiService geminiService, SourceRepository sourceRepository, AudioRepository audioRepository) {
        this.geminiService = geminiService;
        this.sourceRepository = sourceRepository;
        this.audioRepository = audioRepository;
        try {
            Files.createDirectories(audioStoragePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create audio storage directory", e);
        }
    }


    @Transactional
    public AudioOverview generateAudioOverview(Long sourceId) throws IOException {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Source source = sourceRepository.findBySourceIdAndUser_UserId(sourceId, currentUser.getUserId())
                .orElseThrow(() -> new AccessDeniedException("Source not found with id: " + sourceId + " or access denied."));

        System.out.println("Starting audio generation for source id: " + sourceId);

        // Generate title
        String audioTitle = geminiService.generateTitle(source.getContent());
        System.out.println("generated audio title: " + audioTitle);

        // 1. Script
        System.out.println("Generating podcast script ......");
        String script = geminiService.generatePodcastScript(source.getContent());
        System.out.println("generated script : " + script.length() );
        //generate script from summary instead

        // 2. MP3 bytes from Gemini
        System.out.println("generating speech audio : ....");
        byte[] audioData = geminiService.generateSpeech(script);
        System.out.println("Generated audio data length: " + audioData.length);

        // 3. Save MP3 file
        String fileName = "overview_" + sourceId + "_" + UUID.randomUUID() + ".wav";
        Path filePath = audioStoragePath.resolve(fileName);

        try (OutputStream os = new FileOutputStream(filePath.toFile())) {
            os.write(audioData);
        }

        // 4. Store in DB
        AudioOverview audioOverview = new AudioOverview();
        audioOverview.setSource(source);
        audioOverview.setTitle(audioTitle);
        audioOverview.setScript(script);
        audioOverview.setAudioUrl("/audio/" + fileName);
        audioOverview.setCreatedAt(LocalDate.now());

        return audioRepository.save(audioOverview);
    }

    public List<AudioOverview> getAudioOverviewsBySessionId(Long sessionId) {
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        return audioRepository.findBySource_ChatSession_SessionIdAndSource_User_UserId(sessionId, currentUserId);
    }

    public AudioOverview getAudioOverviewById(Long audioId) {
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        AudioOverview audioOverview = audioRepository.findById(audioId)
                .orElseThrow(() -> new RuntimeException("Audio not found"));

        if (!audioOverview.getSource().getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("You do not have permission to view this audio.");
        }

        return audioOverview;
    }

    public AudioOverview updateAudioTitle(Long audioId, String newTitle) {
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        AudioOverview audioOverview = audioRepository.findById(audioId)
                .orElseThrow(() -> new RuntimeException("Audio not found"));

        if (!audioOverview.getSource().getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("You do not have permission to update this audio.");
        }

        audioOverview.setTitle(newTitle);
        return audioRepository.save(audioOverview);
    }

    public void deleteAudioOverview(Long audioId) {
        if (!audioRepository.existsById(audioId)) {
            throw new RuntimeException("Audio not found with id: " + audioId);
        }
        audioRepository.deleteById(audioId);
    }
}
