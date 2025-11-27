package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {
 private Long cardOverViewId;
 private String title;
 private Long sourceId;
 private List<CardDetailResponse> cardDetails;


 //creating a static class called CardDetailResponse
 @Data
 @NoArgsConstructor
 @AllArgsConstructor
 public static class CardDetailResponse {
  private Long cardId;
  private String question;
  private String answer;

  //the way i am handling the get request json,response,perhaps the list<> might be redundant;
 }
}
