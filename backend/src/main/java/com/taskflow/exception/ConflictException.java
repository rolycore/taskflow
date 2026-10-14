package com.taskflow.exception;

/** Conflicto con el estado actual, por ejemplo correo duplicado (HTTP 409). */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
