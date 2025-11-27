package org.dreamteam.repository;

import org.dreamteam.Entity.CodeAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeAnswerRepository extends JpaRepository<CodeAnswer, Long> {
}