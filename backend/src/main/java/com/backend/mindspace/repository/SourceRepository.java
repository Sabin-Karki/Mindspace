package com.backend.mindspace.repository;

import com.backend.mindspace.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SourceRepository extends JpaRepository<Source,Long> {

    List<Source> findByChatSession_SessionId(Long sessionId);

    Optional<Source> findBySourceIdAndUser_UserId(Long sourceId, Long userId);
    Optional<List<Source>> findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(Long sessionId,Long userId, List<Long> sourceIds);
    List<Source> findByChatSession_SessionIdAndUser_UserId(Long sessionId, Long userId);
}
