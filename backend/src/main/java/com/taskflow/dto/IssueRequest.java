package com.taskflow.dto;

import com.taskflow.model.IssueStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IssueRequest(
        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 150, message = "El titulo no puede superar 150 caracteres")
        String titulo,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 1500, message = "La descripcion no puede superar 1500 caracteres")
        String descripcion,

        @Size(max = 1500, message = "La solucion no puede superar 1500 caracteres")
        String solucion,

        @NotNull(message = "El estado es obligatorio")
        IssueStatus estado) {
}
