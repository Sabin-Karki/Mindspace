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
    private  Long flashCardId;
    @ManyToOne
    @JoinColumn(name = "sourceId")
    private Source source;
    @Column(columnDefinition = "TEXT")
    private String question;
    @Column(columnDefinition = "TEXT")
    private String answer;

}
