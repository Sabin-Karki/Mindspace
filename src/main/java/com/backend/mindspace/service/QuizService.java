package com.backend.mindspace.service;

import com.backend.mindspace.entity.Question;
import com.backend.mindspace.entity.QuizOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.repository.QuizOverviewRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class QuizService {

    private final GeminiService geminiService;
    private final SourceRepository sourceRepository;
    private final QuizOverviewRepository quizOverviewRepository;
    private final ObjectMapper objectMapper;

    public QuizService(GeminiService geminiService, SourceRepository sourceRepository, QuizOverviewRepository quizOverviewRepository, ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.sourceRepository = sourceRepository;
        this.quizOverviewRepository = quizOverviewRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public QuizOverview generateAndSaveQuiz(Long sourceId) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source not found with id: " + sourceId));

        // 1. Call AI to get quiz as a JSON string
        String quizJson = geminiService.generateQuiz(source.getContent());

        try {
            // 2. Parse the JSON string into a List of Question objects
            List<Question> questions = objectMapper.readValue(quizJson, new TypeReference<List<Question>>() {});

            // 3. Create the parent QuizOverview entity
            QuizOverview quiz = new QuizOverview();
            quiz.setSource(source);
            quiz.setCreatedAt(LocalDate.now());

            // 4. Associate questions with the quiz
            for (Question question : questions) {
                question.setQuiz(quiz);
            }
            quiz.setQuestions(questions);

            // 5. Save the QuizOverview (and cascade to Questions)
            return quizOverviewRepository.save(quiz);

        } catch (Exception e) {
            // Handle potential JSON parsing errors
            e.printStackTrace();
            throw new RuntimeException("Failed to parse quiz JSON from AI service: " + e.getMessage());
        }
    }
}
