package com.taskflow.dto;

/** Respuesta de login/registro: token JWT y datos basicos del usuario. */
public record AuthResponse(String token, String nombre, String email) {
}
