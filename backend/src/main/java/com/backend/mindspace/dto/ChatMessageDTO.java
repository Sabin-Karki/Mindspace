package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String message;
    private String role;
    private LocalDate createdAt;
}
