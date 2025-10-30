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

    private String title;

    private LocalDate createdAt;

    @Column(columnDefinition = "TEXT")
    private String script;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = true)
    private Source source;

    @Column(columnDefinition = "TEXT")
    private String audioUrl;
}
