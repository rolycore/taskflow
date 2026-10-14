package com.taskflow.dto;

import com.taskflow.model.Issue;
import com.taskflow.model.IssueStatus;

import java.time.LocalDateTime;

public record IssueResponse(
        Long id,
        String titulo,
        String descripcion,
        String solucion,
        IssueStatus estado,
        LocalDateTime createdAt) {

    public static IssueResponse from(Issue i) {
        return new IssueResponse(i.getId(), i.getTitulo(), i.getDescripcion(), i.getSolucion(),
                i.getEstado(), i.getCreatedAt());
    }
}
