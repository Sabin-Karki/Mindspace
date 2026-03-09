package com.backend.mindspace.service;

import com.backend.mindspace.dto.CardResponse;
import com.backend.mindspace.entity.FlashCard;
import com.backend.mindspace.entity.FlashCardOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.FlashCardOverviewRepository;
import com.backend.mindspace.repository.SourceRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FlashCardServiceTest {

    @Mock
    private SourceRepository sourceRepository;

    @Mock
    private GeminiService geminiService;

    @Mock
    private FlashCardOverviewRepository flashCardOverviewRepository;

    private FlashCardService flashCardService;

    @BeforeEach
    void setUp() {
        // Use a real ObjectMapper so the test validates the JSON-to-entity parsing path.
        flashCardService = new FlashCardService(sourceRepository, geminiService, flashCardOverviewRepository, new ObjectMapper());

        // The service reads user id from SecurityContext, so we seed an authenticated principal.
        User principal = new User();
        principal.setUserId(7L);
        principal.setEmail("test-user@example.com");

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        // Keep tests isolated: clear thread-local security state after each test run.
        SecurityContextHolder.clearContext();
    }

    @Test
    void generateAndSaveCardsShouldCreateOverviewAndReturnMetadataResponse() {
        Long sessionId = 11L;
        List<Long> sourceIds = List.of(101L, 102L);

        Source sourceA = new Source();
        sourceA.setSourceId(101L);
        sourceA.setContent("JWT enables stateless authentication.");
        sourceA.setCreatedAt(LocalDate.now());

        Source sourceB = new Source();
        sourceB.setSourceId(102L);
        sourceB.setContent("Spring Security authenticates before issuing tokens.");
        sourceB.setCreatedAt(LocalDate.now());

        String combinedContent = sourceA.getContent() + "\n\n---\n\n" + sourceB.getContent();
        String cardsJson = """
                [
                  {"question":"What is JWT?","answer":"A signed token used for stateless auth."},
                  {"question":"Why use Spring Security?","answer":"To enforce authentication and authorization."}
                ]
                """;

        // Repository guard should return exactly the sources requested by user/session.
        when(sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId, 7L, sourceIds))
                .thenReturn(Optional.of(List.of(sourceA, sourceB)));

        // Stub AI outputs used by generation flow.
        when(geminiService.generateTitle(combinedContent)).thenReturn("JWT Flashcards");
        when(geminiService.generateFlashCard(combinedContent)).thenReturn(cardsJson);

        // Simulate persistence assigning an id to the overview aggregate root.
        when(flashCardOverviewRepository.save(any(FlashCardOverview.class))).thenAnswer(invocation -> {
            FlashCardOverview overview = invocation.getArgument(0);
            overview.setId(900L);
            return overview;
        });

        CardResponse response = flashCardService.generateAndSaveCards(sessionId, sourceIds);

        // Validate API response shape: metadata only, cards intentionally omitted by service design.
        assertEquals(900L, response.getCardOverViewId());
        assertEquals("JWT Flashcards", response.getTitle());
        assertEquals(List.of(101L, 102L), response.getSourceId());
        assertNull(response.getCardDetails());

        // Capture persisted overview and assert aggregate wiring is correct.
        ArgumentCaptor<FlashCardOverview> overviewCaptor = ArgumentCaptor.forClass(FlashCardOverview.class);
        verify(flashCardOverviewRepository).save(overviewCaptor.capture());

        FlashCardOverview savedOverview = overviewCaptor.getValue();
        assertEquals("JWT Flashcards", savedOverview.getTitle());
        assertEquals(2, savedOverview.getSources().size());
        assertEquals(2, savedOverview.getFlashCards().size());

        for (FlashCard card : savedOverview.getFlashCards()) {
            assertNotNull(card.getQuestion());
            assertNotNull(card.getAnswer());
            assertEquals(savedOverview, card.getFlashCard());
        }

        // Verify both AI calls used the same merged source context string.
        verify(geminiService).generateTitle(combinedContent);
        verify(geminiService).generateFlashCard(combinedContent);
    }
}
