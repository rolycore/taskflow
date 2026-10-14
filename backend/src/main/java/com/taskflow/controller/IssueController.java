package com.taskflow.controller;

import com.taskflow.dto.IssueRequest;
import com.taskflow.dto.IssueResponse;
import com.taskflow.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problemas")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    public List<IssueResponse> list(Authentication auth) {
        return issueService.findAll(auth.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueResponse create(Authentication auth, @Valid @RequestBody IssueRequest request) {
        return issueService.create(auth.getName(), request);
    }

    @PutMapping("/{id}")
    public IssueResponse update(Authentication auth, @PathVariable Long id,
                                @Valid @RequestBody IssueRequest request) {
        return issueService.update(auth.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable Long id) {
        issueService.delete(auth.getName(), id);
    }
}
