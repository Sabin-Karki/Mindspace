package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_session")
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "session_id")
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name ="user_id")
    private  User user;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private  Source source;

    private LocalDate createdAt;

    @OneToMany(mappedBy = "chatSession")
    private List<ChatMessage> chatMessages;
}
