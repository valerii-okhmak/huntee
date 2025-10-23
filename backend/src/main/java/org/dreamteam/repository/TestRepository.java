package org.dreamteam.repository;

import java.util.List;

import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByUser(User user);
    List<Test> findByTestName(String testName);
}
