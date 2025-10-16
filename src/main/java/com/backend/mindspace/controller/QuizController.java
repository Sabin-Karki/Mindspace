package com.backend.mindspace.controller;

import com.backend.mindspace.entity.QuizOverview;
import com.backend.mindspace.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate/{sourceId}")
    public ResponseEntity<QuizOverview> generateQuiz(@PathVariable Long sourceId) {
        try {
            QuizOverview quiz = quizService.generateAndSaveQuiz(sourceId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            e.printStackTrace();
            // Consider a more specific error response
            return ResponseEntity.internalServerError().build();
        }
    }
}
