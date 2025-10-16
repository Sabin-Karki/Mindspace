package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class AudioOverview {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private Source source;
    @Column(columnDefinition = "TEXT")
    private String script;

    private String audioUrl;
    private LocalDate createdAt;
}
