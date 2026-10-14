package com.taskflow.dto;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String titulo,
        String descripcion,
        TaskStatus estado,
        TaskPriority prioridad,
        LocalDate fechaLimite,
        LocalDateTime createdAt) {

    /** Convierte la entidad en su representacion publica. */
    public static TaskResponse from(Task t) {
        return new TaskResponse(t.getId(), t.getTitulo(), t.getDescripcion(), t.getEstado(),
                t.getPrioridad(), t.getFechaLimite(), t.getCreatedAt());
    }
}
