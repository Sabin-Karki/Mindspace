package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class QuizOverview {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;
    private LocalDate createdAt;

    //need to make the source into ArrayList so multiple sources selected is associated with one quiz<overview generated>
    @ManyToMany
    @JoinTable(
            name="quizoverview_source",
            joinColumns=@JoinColumn(name="quizoverview_id"),
            inverseJoinColumns = @JoinColumn(name="source_id")
    )
    private List<Source> sources = new ArrayList<>(); // this now holds multiple sources

      @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
}