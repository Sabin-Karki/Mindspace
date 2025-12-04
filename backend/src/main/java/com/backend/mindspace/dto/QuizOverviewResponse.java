package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizOverviewResponse {
  private Long quizId;
  private String title;
  private List<Long> sourceId;
  private List<QuestionResponse> questions;  // ← MUST HAVE THIS

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class QuestionResponse {
    private Long questionId;
    private String questionText;
    private List<String> options;
    private int correctAnswerIndex;
  }
}