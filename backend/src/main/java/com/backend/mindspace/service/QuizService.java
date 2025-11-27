package com.backend.mindspace.service;

import com.backend.mindspace.dto.CardResponse;
import com.backend.mindspace.dto.QuizOverviewResponse;
import com.backend.mindspace.entity.Question;
import com.backend.mindspace.entity.QuizOverview;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.QuizOverviewRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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
    public QuizOverviewResponse generateAndSaveQuiz(Long sessionId, List<Long> sourceIds) {
        Long currentUserId=((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        List<Source> selectedSources = sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId,currentUserId,sourceIds)
                .orElseThrow(()->new RuntimeException("Source not found for the given session and user"));

        if(selectedSources.size()!= sourceIds.size()){
            throw new RuntimeException("Some sources not found for given session and user");
        }
        //now from the source object ,the selected source object i will need the content,remember it is a list,so i will use stream to combine the content of all selected sources as stream is used to process collections
        String combinedContent = selectedSources.stream()
                .map(Source::getContent)
                .collect(Collectors.joining("\n\n---\n\n"));
        //get title for the quiz
        String quizTitle = geminiService.generateTitle(combinedContent);
        // 1. Call AI to get quiz as a JSON string
        String quizJson = geminiService.generateQuiz(combinedContent);
        try {
            // 2. Parse the JSON string into a List of Question objects
            List<Question> questions = objectMapper.readValue(quizJson, new TypeReference<List<Question>>() {});

            // 3. Create the parent QuizOverview entity
            QuizOverview quiz = new QuizOverview();
            quiz.setTitle(quizTitle);

            Source sourceToSet = null;
            if(selectedSources.size()==1){
                sourceToSet = selectedSources.getFirst();
            }
            // If multiple sources were selected, sourceToSet remains null to indicate aggregation
            quiz.setSource(sourceToSet);
            quiz.setCreatedAt(LocalDate.now());

            // 4. Associate questions with the quiz
            for (Question question : questions) {
                question.setQuiz(quiz);
            }
            quiz.setQuestions(questions);
            // 5. Save the QuizOverview (and cascade to Questions)
            quizOverviewRepository.save(quiz);
            return new QuizOverviewResponse(quiz.getId(),quizTitle,quiz.getSource()!=null?quiz.getSource().getSourceId():null,null);


        } catch (Exception e) {
            // Handle potential JSON parsing errors
            e.printStackTrace();
            throw new RuntimeException("Failed to parse quiz JSON from AI service: " + e.getMessage());
        }
    }

    //get quizoverview by specific id
    public QuizOverviewResponse getQuizById(Long id){
        QuizOverview quizOverview = quizOverviewRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Quiz not found with id" + id));
        //what the above statement did was,it tried to find the quiz by the quiz id passed as argument and jpa basically first checks quiz overview entity and if an primary key field exists and then it returns the quiz object as in doing the select * from quiz_overview where id = ?
        Long quizId = quizOverview.getId();
        String title = quizOverview.getTitle();
//        Long sourceId = quizOverview.getSource()!=null? quizOverview.getSource().getSourceId():null;
        List<QuizOverviewResponse.QuestionResponse> questionResponses = quizOverview.getQuestions().stream()
                .map(question->new QuizOverviewResponse.QuestionResponse(question.getId(), question.getQuestionText(),question.getOptions(),question.getCorrectAnswerIndex()))
                .collect(Collectors.toList());
        return new QuizOverviewResponse(quizId,title,quizOverview.getSource()!=null? quizOverview.getSource().getSourceId():null,questionResponses);
    }

    //get mapping for quiz by session id
    public List<QuizOverviewResponse> getQuizzesBySessionId(Long sessionId) {
        Long currentUserId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        List<QuizOverview> quizzes = quizOverviewRepository.findBySource_ChatSession_SessionIdAndSource_User_UserId(sessionId, currentUserId);

        return quizzes.stream()
                .map(quiz -> {
                    List<QuizOverviewResponse.QuestionResponse> questionResponses = quiz.getQuestions().stream()
                            .map(q -> new QuizOverviewResponse.QuestionResponse(
                                    q.getId(), q.getQuestionText(), q.getOptions(), q.getCorrectAnswerIndex()))
                            .collect(Collectors.toList());

                    return new QuizOverviewResponse(
                            quiz.getId(), quiz.getTitle(),
                            quiz.getSource() != null ? quiz.getSource().getSourceId() : null,
                            questionResponses
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizOverviewResponse updateQuiz(Long quizId, String newTitle) {
    QuizOverview existingQuiz = quizOverviewRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));

              existingQuiz.setTitle(newTitle);
        //i only want the title to be updated just like notebook llm
        quizOverviewRepository.save(existingQuiz);
        return new QuizOverviewResponse(existingQuiz.getId(), existingQuiz.getTitle(), existingQuiz.getSource()!=null? existingQuiz.getSource().getSourceId():null,null);

    }

    public void deleteQuiz(Long quizId) {
        if (!quizOverviewRepository.existsById(quizId)) {
            throw new RuntimeException("Quiz not found with ID: " + quizId);
        }
        quizOverviewRepository.deleteById(quizId);
    }
}
