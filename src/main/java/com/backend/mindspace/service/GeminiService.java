package com.backend.mindspace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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
        try {
            String payload = """
                    {
                      "input": {
                        "text": "%s"
                      },
                      "voice": {
                        "languageCode": "en-US",
                        "name": "en-US-Studio-O"
                      },
                      "audioConfig": {
                        "audioEncoding": "MP3"
                      }
                    }
                    """.formatted(text.replace("", "\""));

            // Note: This uses the Google Cloud Text-to-Speech API endpoint, which is different from the Gemini API endpoint.
            String responseJson = webClient.post()
                    .uri("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            String audioContent = root.path("audioContent").asText();
            return java.util.Base64.getDecoder().decode(audioContent);
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}


