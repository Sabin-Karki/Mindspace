package com.backend.mindspace.controller;

import com.backend.mindspace.dto.QuizOverviewResponse;
import com.backend.mindspace.dto.QuizRequestDTO;
import com.backend.mindspace.dto.QuizUpdate;
import com.backend.mindspace.entity.QuizOverview;
import com.backend.mindspace.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate/{sessionId}")
    public ResponseEntity<QuizOverviewResponse> generateQuiz(@PathVariable Long sessionId, @RequestBody QuizRequestDTO quizRequestDTO) {
        try {
            QuizOverviewResponse quiz = quizService.generateAndSaveQuiz(sessionId,quizRequestDTO.getSourceIds());
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            e.printStackTrace();
            // Consider a more specific error response
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizOverviewResponse> getQuizById(@PathVariable Long quizId) {
        try {
             QuizOverviewResponse quiz = quizService.getQuizById(quizId);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<QuizOverviewResponse>> getQuizzesBySessionId(@PathVariable Long sessionId) {
        try {
            List<QuizOverviewResponse> quizzes = quizService.getQuizzesBySessionId(sessionId);
            return ResponseEntity.ok(quizzes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<QuizOverviewResponse> updateQuiz(@PathVariable Long quizId, @RequestBody QuizUpdate quizUpdate) {
        try {
            QuizOverviewResponse updatedQuiz = quizService.updateQuiz(quizId,quizUpdate.getTitle());
            return ResponseEntity.ok(updatedQuiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        try {
            quizService.deleteQuiz(quizId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
