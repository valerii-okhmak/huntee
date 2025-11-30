package org.dreamteam.repository;

import org.dreamteam.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {

    List<Test> findByUser_Id(UUID userId);
}
