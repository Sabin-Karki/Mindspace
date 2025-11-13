package com.backend.mindspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Array;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
public class Chunk {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "chunk_id")
    private Long chunkId;

    @Column(columnDefinition = "TEXT")
    private String chunkText;


    @Column(name = "embedding", columnDefinition ="vector(1536)")
    private float[] embedding;
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private Source source;

}
