package org.dreamteam.repository;
import org.dreamteam.Entity.TestInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;
import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.InvitationStatus;

@Repository
public interface TestInvitationRepository extends JpaRepository<TestInvitation, UUID> {
    List<TestInvitation> findByToken(String token);
    boolean existsByTestAndEmailAndStatus(Test test, String email, InvitationStatus status);
}

