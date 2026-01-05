package com.backend.mindspace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

@Service
public class GeminiService implements AIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder builder, ObjectMapper objectMapper) {
        this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .exchangeStrategies(org.springframework.web.reactive.function.client.ExchangeStrategies.builder()
                        .codecs(configurer -> configurer
                                .defaultCodecs()
                                .maxInMemorySize(20 * 1024 * 1024)) // 20 MB
                        .build())
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public String generateTitle(String content) {
        String prompt = "Generate a concise title (max 10 words ) for this content : \n\n" + content;
        return callGeminiTextApi(prompt);
    }

    @Override
    public String generateSummary(String content) {
        String prompt = "Summarize the following content in a paragraph ,try to make it 1 paragraph most of the time and make sure it has minimum of 120 words when it is possible : \n\n" + content;
        return callGeminiTextApi(prompt);
    }

    @Override
    public String generateQuiz(String content) {
        String prompt = """
                Generate a quiz with 12 to 16 multiple-choice questions based on the following content.
                Return ONLY valid JSON — no explanations, no markdown, and no text outside the JSON array.
                
                Each object in the JSON array must contain EXACTLY these three fields:
                - "questionText" (a string)
                - "options" (an array of exactly 4 strings)
                - "correctAnswerIndex" (an integer from 0 to 3 indicating the correct option)
                
                Example format:
                [
                  {
                    "questionText": "What is the capital of France?",
                    "options": ["Paris", "Rome", "Madrid", "Berlin"],
                    "correctAnswerIndex": 0
                  },
                  {
                    "questionText": "Which planet is known as the Red Planet?",
                    "options": ["Venus", "Mars", "Jupiter", "Mercury"],
                    "correctAnswerIndex": 1
                  }
                ]
                
                Content:
                
                """ + content;
        return callGeminiTextApi(prompt);
    }

    @Override
    public String generateFlashCard(String content) {
        String prompt = """
                Generate 10–12 flashcards based on the following content.Each flashcard must have a 'question' and an 'answer' field.Return ONLY valid JSON, no explanations, no markdown.
                Example format:
                [
                  {"question": "...", "answer": "..."},
                  {"question": "...", "answer": "..."}
                ]
                Content:
                
                """ + content;
        return callGeminiTextApi(prompt);
    }

    //adding report generation
    @Override
    public String generateReport(String content) {
        String prompt = """
                Create a comprehensive briefing document that synthesizes the main themes and ideas from the sources. Start with a concise Executive Summary that presents the most critical takeaways upfront. The body of the document must provide a detailed and thorough examination of the main themes, evidence, and conclusions found in the sources. This analysis should be structured logically with headings and bullet points to ensure clarity. The tone must be objective and incisive.
                
                        **Formatting Guidelines**:
                        - Use Markdown for all structure:
                          - # Main Heading for top-level sections (e.g., Executive Summary).
                          - ## Subheading for subsections.
                          - **Bold key phrases, sentences, or takeaways** with **double asterisks** (e.g., **This is a critical insight**).
                          - Use - or * for bullet points.
                          - Italicize *supporting evidence* with single asterisks if needed for nuance.
                        - Ensure the output is clean, scannable, and professional—no extra fluff or plain paragraphs without breaks.
                        Output only the formatted document; no intro/explanatory text.
                
                      Content:
                
                """ + content;
        return callGeminiTextApi(prompt);
    }

    @Override
    public float[] generateEmbedding(String content) {
        try {
            String payload = """
                {
                  "model": "models/embedding-001",
                  "content": {
                    "parts": [
                      {"text": "%s"}
                    ]
                  },
                  "outputDimensionality": 1536
                }
                """.formatted(content.replace("\"", "\\\""));

            String responseJson = webClient.post()
                    .uri("/models/gemini-embedding-001:embedContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode embeddingArray = root.path("embedding").path("values");

            if (embeddingArray.isArray()) {
                float[] embedding = new float[embeddingArray.size()];
                for (int i = 0; i < embeddingArray.size(); i++) {
                    embedding[i] = (float) embeddingArray.get(i).asDouble();
                }
                return embedding;
            }
            return new float[0];
        } catch (Exception e) {
            System.err.println("Error generating embedding: " + e.getMessage());
            return new float[0];
        }
    }

    //i need to create a new method with a 2.5-flash-lite model to make sure i have enough limit strictly for Chat purpose only,20 back and forth is enough,20 answers.

    public String callGeminiTextApiForAnswer(String prompt){
        try{
            String payload = """
                    {
                    "contents":[
                    {
                    "parts": [
                    {
                    "text": "%s"
                    }
                    ]
                    }
                    ],
                    "generationConfig": {
                    "thinkingConfig": {
                    "thinkingBudget":0
                    }
                    }
                    }
                    """.formatted(prompt.replace("\"","\\\""));

            String responseJson = webClient.post()
                    .uri("/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates=root.path("candidates");
            if(candidates.isArray() && !candidates.isEmpty()){
                return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            }
            return "No text response";
        }catch (Exception e){
          return  e.getMessage();
        }
    }

    public String callGeminiTextApi(String prompt) {
        try {
            String payload = """
                    {
                    "contents": [
                    {
                    "parts": [
                    {
                    "text": "%s"
                    }
                    ]
                    }
                    ],
                    "generationConfig": {
                    "thinkingConfig":{
                    "thinkingBudget":0
                    }
                    }
                    }
                    """.formatted(prompt.replace("\"", "\\\""));

            //making the post call to gemini model // what is needed  -headers,contenttype,the request body which is the payload created and retrieving the response

            String responseJson = webClient.post()
                    .uri("/models/gemini-2.5-flash:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            }
            return "No text response";
        } catch (Exception e) {
            System.err.println("Error calling Gemini Text API: " + e.getMessage());
            // e.printStackTrace(); // Keep for full stack trace if needed
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String generatePodcastScript(String content) {
        String prompt = """
            Generate a concise podcast script based on the following content.
            
            STRICT CONSTRAINTS:
            - Maximum length: 1300 characters (approx 1-3 minutes).
            - Tone: Engaging, conversational, and energetic.
            - Structure: Intro, Main Body (Key Takeaways), and Outro.
            - Do not include scene directions like [Music Fades], just the spoken text.
            
            Content:
            """ + content;

        return callGeminiTextApi(prompt);
    }

    @Override
    public byte[] generateSpeech(String text) {
        Path pcmFile = null;
        Path wavFile = null;
        try {
            System.out.println(" Calling Gemini TTS API - script length: " + text.length() + " chars");
            long apiStart = System.currentTimeMillis();

            String payload = """
            {
                "contents": [{"parts":[{"text": "%s"}]}],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Kore"}}}
                },
                "model": "gemini-2.5-flash-preview-tts"
            }
            """.formatted(text.replace("\"","\\\""));

            String responseJson = webClient.post()
                    .uri("/models/gemini-2.5-flash-preview-tts:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Gemini API responded in " + (System.currentTimeMillis() - apiStart) + "ms");

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates == null || !candidates.isArray() || candidates.isEmpty()) {
                System.err.println("Error from Gemini API: No candidates returned. Response: " + responseJson);
                throw new RuntimeException("Failed to generate speech. The API returned no content, possibly due to safety filters.");
            }

            System.out.println("Decoding base64 audio data...");
            String audioContent = candidates.get(0).path("content").path("parts").get(0).path("inlineData").path("data").asText();
            byte[] pcmData = java.util.Base64.getDecoder().decode(audioContent);
            System.out.println("Decoded " + pcmData.length + " bytes of PCM data");

            System.out.println("Writing PCM to temp file...");
            pcmFile = Files.createTempFile("mindspace-audio", ".pcm");
            Files.write(pcmFile, pcmData);

            wavFile = pcmFile.resolveSibling(pcmFile.getFileName().toString().replace(".pcm", ".wav"));

            System.out.println("Running ffmpeg conversion...");
            long ffmpegStart = System.currentTimeMillis();
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1",
                    "-i", pcmFile.toAbsolutePath().toString(), wavFile.toAbsolutePath().toString()
            );

            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            System.out.println("ffmpeg completed in " + (System.currentTimeMillis() - ffmpegStart) + "ms");

            if (exitCode != 0) {
                String errorOutput = new String(process.getErrorStream().readAllBytes());
                System.err.println("ffmpeg error: " + errorOutput);
                throw new RuntimeException("ffmpeg process failed with exit code " + exitCode + ": " + errorOutput);
            }

            System.out.println("Reading WAV file......");
            byte[] wavData = Files.readAllBytes(wavFile);
            System.out.println("Final WAV size: " + wavData.length + " bytes");

            if (wavData.length == 0) {
                throw new RuntimeException("WAV file is empty after ffmpeg conversion");
            }

            return wavData;

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        } finally {
            try {
                if (pcmFile != null) Files.deleteIfExists(pcmFile);
                if (wavFile != null) Files.deleteIfExists(wavFile);
            } catch (java.io.IOException e) {
                e.printStackTrace();
            }
        }
    }
}


