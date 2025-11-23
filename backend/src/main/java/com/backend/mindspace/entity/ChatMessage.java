package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_message")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;
    @Column(columnDefinition = "TEXT")
    private String message;
    private String role;
    private LocalDate createdAt;
    @ManyToOne
    @JoinColumn(name = "session_id")
    private  ChatSession chatSession;
}
