package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashCardOverview {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long id;
    private String title;
    private LocalDate createdAt;

    @ManyToMany
    @JoinTable(
            name="flashcardoverview_source",
            joinColumns=@JoinColumn(name="flashcardoverview_id"),
            inverseJoinColumns=@JoinColumn(name="source_id")
    )
    private List<Source> sources = new ArrayList<>();
    @OneToMany(mappedBy = "flashCard",cascade = CascadeType.ALL,orphanRemoval = true)
    List<FlashCard> flashCards = new ArrayList<>();
}
