@ExtendWith(MockitoExtension.class)
class QuizServiceTest {
    @Mock
    private SourceRepository sourceRepository;
    @Mock
    private GeminiService geminiService;
    @Mock
    private QuizOverviewRepository quizOverviewRepository;

    private QuizService quizService;

    //method will be executed before the test method
    @BeforeEach
    void setUp() {
        //objectmapper used for s-d of data for proper traversal
        quizService = new QuizService(sourceRepository,geminiService,quizOverviewRepository,new ObjectMapper());

        //service will read the user id from scontext
        User principal = new User();
        principal.setUserId(5l);
        principal.setEmail"test-user1@example.com");

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principal,null,principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void generateAndSaveQuizResponse() {
        Long sessionId= 12L;
        List<Long> sourceIds = List.of(101L,102L);

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

        when(sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId,5L,sourceIds))
                .thenReturn(Optional.of(List.of(sourceA,sourceB)));

        //when (k-v matches) then return
        when(geminiService.generateTitle(combinedContent)).thenReturn("Hannibal Revenge");
        when(geminiService.generateQuiz(combinedContent)).thenReturn(quizJson);

        //simulating id being set
        when(quizOverviewRepository.save(any(QuizOverview.class))).thenAnswer(invocation ->{
            QuizOverview overview = invocation.getArgument(0)l
                    overview.setId(99L);
            return overview;
        });
        // trigger the method
        QuizOverviewResponse response = quizService.generateAndSaveQuiz(sessionId,sourceIds);

        //verify
        assetEquals(99L,response.getId());
        assertEquals("Hannibal Revenge",response.getTitle());
        assertEquals(List.of(101L,102L),response.getSourceId());
        assertNull(response.getCardDetails());

        //verifying if repository actually got quiz with 2 question
        ArgumentCaptor<QuizOverview> captor = ArgumentCaptor.forClass(QuizOverview.class);
        verify(quizOverviewRepository).save(Captor.captor());

        QuizOverview savedQuiz= captor.getValue();
        assertEquals(2,savedQuiz.getQuestions().size());
        assertEquals("Who is the son of hamilcar ?" , savedQuiz.getQuestions().get(0).getQuestionText());

        assertEquals(savedQuiz,savedQuiz.getQuestions().get(0).getQuiz());


    }
}