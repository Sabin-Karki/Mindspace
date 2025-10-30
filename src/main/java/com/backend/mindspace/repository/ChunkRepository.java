package com.backend.mindspace.repository;

import com.backend.mindspace.entity.Chunk;
import com.backend.mindspace.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChunkRepository extends JpaRepository<Chunk,Long> {
    List<Chunk> findBySource_SourceId(Long id);
    int countBySource(Source source);

    void deleteBySource(Source source);
}
