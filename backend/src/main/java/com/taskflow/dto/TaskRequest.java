package com.taskflow.dto;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 150, message = "El titulo no puede superar 150 caracteres")
        String titulo,

        @Size(max = 1000, message = "La descripcion no puede superar 1000 caracteres")
        String descripcion,

        @NotNull(message = "El estado es obligatorio")
        TaskStatus estado,

        @NotNull(message = "La prioridad es obligatoria")
        TaskPriority prioridad,

        LocalDate fechaLimite) {
}
