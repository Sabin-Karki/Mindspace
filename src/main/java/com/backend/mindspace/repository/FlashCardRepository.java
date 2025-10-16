package com.backend.mindspace.repository;

import com.backend.mindspace.entity.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashCardRepository extends JpaRepository<FlashCard,Long> {
}
