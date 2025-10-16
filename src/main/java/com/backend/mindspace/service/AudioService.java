package com.backend.mindspace.service;

import com.backend.mindspace.entity.AudioOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.repository.AudioRepository;
import com.backend.mindspace.repository.SourceRepository;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
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

    public AudioOverview generateAudioOverview(Long sourceId) throws IOException {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source not found with id: " + sourceId));

        // 1. Generate podcast script
        String script = geminiService.generatePodcastScript(source.getContent());

        // 2. Generate audio from script
        byte[] audioData = geminiService.generateSpeech(script);

        // 3. Save audio to a file
        String fileName = "overview_" + sourceId + "_" + UUID.randomUUID() + ".mp3";
        Path filePath = audioStoragePath.resolve(fileName);
        try (OutputStream os = new FileOutputStream(filePath.toFile())) {
            os.write(audioData);
        }

        // 4. Create and save AudioOverview entity
        AudioOverview audioOverview = new AudioOverview();
        audioOverview.setSource(source);
        audioOverview.setScript(script);
        audioOverview.setAudioUrl("/audio/" + fileName); // URL path for access
        audioOverview.setCreatedAt(LocalDate.now());

        return audioRepository.save(audioOverview);
    }
}
