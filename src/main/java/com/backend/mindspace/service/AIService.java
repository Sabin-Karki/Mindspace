package com.backend.mindspace.service;

public interface AIService {
    String generateTitle(String content);
    String generateSummary(String content);
    String generateQuiz(String content);
    float[] generateEmbedding(String content);
    String generatePodcastScript(String content);
    String generateFlashCard(String content);
    byte[] generateSpeech(String text);
}
