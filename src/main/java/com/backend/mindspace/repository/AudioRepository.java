package com.backend.mindspace.repository;

import com.backend.mindspace.entity.AudioOverview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioRepository extends JpaRepository<AudioOverview,Long> {
}
