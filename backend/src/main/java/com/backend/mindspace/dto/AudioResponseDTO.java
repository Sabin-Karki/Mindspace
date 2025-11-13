package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioResponseDTO {
    private Long id;
    private String title;
    private LocalDate createdAt;
    private String audioUrl;
}
