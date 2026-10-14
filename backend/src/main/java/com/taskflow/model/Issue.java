package com.taskflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Problema reportado por un usuario, con su solucion documentada. */
@Entity
@Table(name = "problemas")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 1500)
    private String descripcion;

    /** Solucion aplicada o propuesta (opcional hasta que se resuelva). */
    @Column(length = 1500)
    private String solucion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IssueStatus estado = IssueStatus.ABIERTO;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getSolucion() { return solucion; }
    public void setSolucion(String solucion) { this.solucion = solucion; }
    public IssueStatus getEstado() { return estado; }
    public void setEstado(IssueStatus estado) { this.estado = estado; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
