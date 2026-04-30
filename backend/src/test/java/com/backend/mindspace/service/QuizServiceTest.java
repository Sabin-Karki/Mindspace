package com.backend.mindspace.service;

import com.backend.mindspace.entity.*;
import com.backend.mindspace.repository.*;
import com.backend.mindspace.dto.QuizOverviewResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private SourceRepository sourceRepository;

    @Mock
    private GeminiService geminiService;

    @Mock
    private QuizOverviewRepository quizOverviewRepository;

    private QuizService quizService;

    @BeforeEach
    void setUp() {
        quizService = new QuizService(geminiService, sourceRepository,quizOverviewRepository, new ObjectMapper());

        User principal = new User();
        principal.setUserId(5L);
        principal.setEmail("test-user1@example.com");

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void generateAndSaveQuizResponse() {
        Long sessionId = 12L;
        List<Long> sourceIds = List.of(101L, 102L);

        Source sourceA = new Source();
        sourceA.setSourceId(101L);
        sourceA.setContent("Hannibal was the son of hamilcar and seeked revenge");
        sourceA.setCreatedAt(LocalDate.now());

        Source sourceB = new Source();
        sourceB.setSourceId(102L);
        sourceB.setContent("Hannibal spent 13 years in rome before returning back to carthage to face africanus");
        sourceB.setCreatedAt(LocalDate.now());

        String combinedContent = sourceA.getContent() + "\n\n---\n\n" + sourceB.getContent();

        String quizJson = """
                [
                  {
                    "questionText": "Who is the son of hamilcar ?",
                    "options": ["Paris", "Rome", "Hannibal", "Berlin"],
                    "correctAnswerIndex": 2
                  },
                  {
                    "questionText": "how many year did it take for hannibal to return to carthage?",
                    "options": ["9", "13", "5", "2"],
                    "correctAnswerIndex": 1
                  }
                ]
                """;

        when(sourceRepository
                .findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId, 5L, sourceIds))
                .thenReturn(Optional.of(List.of(sourceA, sourceB)));

        when(geminiService.generateTitle(combinedContent))
                .thenReturn("Hannibal Revenge");

        when(geminiService.generateQuiz(combinedContent))
                .thenReturn(quizJson);

        when(quizOverviewRepository.save(any(QuizOverview.class)))
                .thenAnswer(invocation -> {
                    QuizOverview overview = invocation.getArgument(0);
                    overview.setId(99L);
                    return overview;
                });

        QuizOverviewResponse response =
                quizService.generateAndSaveQuiz(sessionId, sourceIds);

        assertEquals(99L, response.getQuizId());
        assertEquals("Hannibal Revenge", response.getTitle());
        assertEquals(List.of(101L, 102L), response.getSourceId());
        assertNull(response.getQuestions());

        ArgumentCaptor<QuizOverview> captor =
                ArgumentCaptor.forClass(QuizOverview.class);

        verify(quizOverviewRepository).save(captor.capture());

        QuizOverview savedQuiz = captor.getValue();

        assertEquals(2, savedQuiz.getQuestions().size());
        assertEquals(
                "Who is the son of hamilcar ?",
                savedQuiz.getQuestions().get(0).getQuestionText()
        );

        assertEquals(
                savedQuiz,
                savedQuiz.getQuestions().get(0).getQuiz()
        );
    }
}