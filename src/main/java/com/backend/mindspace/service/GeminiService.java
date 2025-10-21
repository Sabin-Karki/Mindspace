package com.backend.mindspace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class GeminiService implements AIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder builder, ObjectMapper objectMapper) {
        this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
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
    public String generateQuiz(String content){
        String prompt = "Generate a quiz with 12 to 16 multiple-choice questions based on the following content. Return the output as a single, well-formed JSON array. Each object in the array should represent a question and must contain the following three fields ONLY: 'questionText' (a string), 'options' (an array of exactly 4 strings), and 'correctAnswerIndex' (an integer from 0 to 3 indicating the correct option). Do not include any other text or explanations outside of the JSON array. The content is: \n\n " + content;
        return callGeminiTextApi(prompt);
    }
    @Override
    public String generateFlashCard(String content){
        String prompt="Generate 10 minimum and 12 maximum flashcard appropriate question based on  the following content which is provided. Return the output of each question too . Return it in a well formed array , the object in the json should represent 'question ' and 'answer' in the response : \n\n" + content;
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
                      }
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
            e.printStackTrace();
            return new float[0];
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
            e.printStackTrace();
            return "Error " + e.getMessage();
        }
    }

    @Override
    public String generatePodcastScript(String content) {
        String prompt = "Generate a 6-to-9-minute podcast script based on the following content. The script should be engaging, conversational, and structured like a podcast episode with an intro, main body discussing the key points, and an outro. The content is:\n\n" + content;
        return callGeminiTextApi(prompt);
    }

    @Override
    public byte[] generateSpeech(String text) {
        Path pcmFile = null;
        Path wavFile = null;
        try {
            // 1. Get audio data from API
            String payload = """
                    {
                        "model": "gemini-2.5-flash-preview-tts",
                        "contents": [{"parts":[{"text": "%s"}]}],
                        "generationConfig": {
                            "responseModalities": ["AUDIO"],
                            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Kore"}}}
                        }
                    }
                    """.formatted(text.replace("\"", "\\\""));

            String responseJson = webClient.post()
                    .uri("/models/gemini-2.5-flash-preview-tts:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            String audioContent = root.path("candidates").get(0).path("content").path("parts").get(0).path("inlineData").path("data").asText();
            byte[] pcmData = java.util.Base64.getDecoder().decode(audioContent);

            // 2. Save PCM data to a temporary file
            pcmFile = Files.createTempFile("mindspace-audio", ".pcm");
            Files.write(pcmFile, pcmData);

            // 3. Define path for the output WAV file
            wavFile = pcmFile.resolveSibling(pcmFile.getFileName().toString().replace(".pcm", ".wav"));

            // 4. Run ffmpeg to convert PCM to WAV
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg", "-y", // -y to overwrite output file if it exists
                    "-f", "s16le",
                    "-ar", "24000",
                    "-ac", "1",
                    "-i", pcmFile.toAbsolutePath().toString(),
                    wavFile.toAbsolutePath().toString()
            );
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                // In a real application, you would add more robust error handling here
                throw new RuntimeException("ffmpeg process failed with exit code " + exitCode);
            }

            // 5. Read the generated WAV file into a byte array
            return Files.readAllBytes(wavFile);

        } catch (Exception e) {
            e.printStackTrace(); // Proper logging should be used here
            return new byte[0];
        } finally {
            // 6. Clean up temporary files
            try {
                if (pcmFile != null) Files.deleteIfExists(pcmFile);
                if (wavFile != null) Files.deleteIfExists(wavFile);
            } catch (java.io.IOException e) {
                e.printStackTrace();
            }
        }
    }
}
