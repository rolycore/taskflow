package com.taskflow.service;

import com.taskflow.dto.IssueRequest;
import com.taskflow.dto.IssueResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Issue;
import com.taskflow.model.User;
import com.taskflow.repository.IssueRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Modulo "Solucion de problemas": registro de problemas y de su solucion. */
@Service
@Transactional
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public IssueService(IssueRepository issueRepository, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> findAll(String email) {
        return issueRepository.findByUsuarioEmailOrderByCreatedAtDesc(email).stream()
                .map(IssueResponse::from)
                .toList();
    }

    public IssueResponse create(String email, IssueRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Issue issue = new Issue();
        issue.setUsuario(user);
        apply(issue, request);
        return IssueResponse.from(issueRepository.save(issue));
    }

    public IssueResponse update(String email, Long id, IssueRequest request) {
        Issue issue = findOwned(email, id);
        apply(issue, request);
        return IssueResponse.from(issueRepository.save(issue));
    }

    public void delete(String email, Long id) {
        issueRepository.delete(findOwned(email, id));
    }

    private Issue findOwned(String email, Long id) {
        return issueRepository.findByIdAndUsuarioEmail(id, email)
                .orElseThrow(() -> new ResourceNotFoundException("Problema no encontrado"));
    }

    private void apply(Issue issue, IssueRequest request) {
        issue.setTitulo(request.titulo().trim());
        issue.setDescripcion(request.descripcion());
        issue.setSolucion(request.solucion());
        issue.setEstado(request.estado());
    }
}
