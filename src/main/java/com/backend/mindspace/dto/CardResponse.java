package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {
 private Long cardOverViewId;
 private String title;
 private Long sourceId;
 private String question;
 private String answer;
}
