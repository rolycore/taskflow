package com.taskflow.exception;

/** Recurso inexistente o que no pertenece al usuario autenticado (HTTP 404). */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
