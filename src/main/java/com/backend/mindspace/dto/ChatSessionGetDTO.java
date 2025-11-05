package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionGetDTO {
 private Long sessionId;
 private LocalDate createdAt;
 private String title;
}
