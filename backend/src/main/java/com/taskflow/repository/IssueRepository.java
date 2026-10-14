package com.taskflow.repository;

import com.taskflow.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByUsuarioEmailOrderByCreatedAtDesc(String email);

    Optional<Issue> findByIdAndUsuarioEmail(Long id, String email);
}
