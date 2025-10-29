package com.backend.mindspace.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "source_id")
    private Long sourceId;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String summary;
    private String fileName;
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "source")
    private List<Chunk> chunks;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ChatSession chatSession;

    @OneToMany(mappedBy = "source")
    private List<AudioOverview> audioOverviews;

    @OneToMany(mappedBy = "source")
    private List<QuizOverview> quizOverviews;

    @OneToMany(mappedBy = "source")
    private List<FlashCardOverview> flashCardOverviews;


}
