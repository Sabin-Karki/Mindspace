package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Type;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
public class ReportGeneration {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long reportId;
    private String reportTitle;
    @Column(columnDefinition = "TEXT")
    private String reportContent;
    private LocalDate createdAt;

    //establish relationship with source entity
    @ManyToOne
    @JoinColumn(name = "source_id")
    private Source source;
}
