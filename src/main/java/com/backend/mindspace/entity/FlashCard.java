package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long  id;
    @Column(columnDefinition = "TEXT")
    private String question;
    @Column(columnDefinition = "TEXT")
    private String answer;
    @ManyToOne
    @JoinColumn(name = "flashcardId",nullable = false)
    private  FlashCardOverview flashCard;

}
