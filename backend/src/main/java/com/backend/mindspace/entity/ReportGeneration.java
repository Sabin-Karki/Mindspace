package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
   @ManyToMany
   @JoinTable(
           name="reportgeneration_source",
           joinColumns = @JoinColumn(name="reportgeneration_id"),
           inverseJoinColumns = @JoinColumn(name = "source_id")
   )
    private List<Source> sources = new ArrayList<>();
}
