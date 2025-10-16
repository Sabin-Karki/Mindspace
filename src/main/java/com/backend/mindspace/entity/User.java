package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name ="user_id")
    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private  String  password;
    private LocalDate createdAt;

    @OneToMany(mappedBy = "user")
    private List<Source> sources;

    @OneToMany(mappedBy = "user")
    private List<ChatSession> chatSessions;
}
