package org.dreamteam.repository;

import org.dreamteam.Entity.MatchingPair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchingPairRepository extends JpaRepository<MatchingPair, Long> {

    List<MatchingPair> findByQuestion_QuestionId(UUID questionId);
}