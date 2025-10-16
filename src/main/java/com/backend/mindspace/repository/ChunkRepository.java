package com.backend.mindspace.repository;

import com.backend.mindspace.entity.Chunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChunkRepository extends JpaRepository<Chunk,Long> {
    List<Chunk> findBySourceId(Long id);
}
