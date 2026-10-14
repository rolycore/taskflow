-- TaskFlow - esquema PostgreSQL
-- Opcional: la API crea las tablas sola (spring.jpa.hibernate.ddl-auto=update).
-- Uso: psql -U postgres -c "CREATE DATABASE taskflow;" && psql -U postgres -d taskflow -f schema.sql

CREATE TABLE IF NOT EXISTS usuarios (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tareas (
    id            BIGSERIAL PRIMARY KEY,
    titulo        VARCHAR(150)  NOT NULL,
    descripcion   VARCHAR(1000),
    estado        VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE'
                  CHECK (estado IN ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA')),
    prioridad     VARCHAR(20)   NOT NULL DEFAULT 'MEDIA'
                  CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA')),
    fecha_limite  DATE,
    usuario_id    BIGINT        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problemas (
    id           BIGSERIAL PRIMARY KEY,
    titulo       VARCHAR(150)  NOT NULL,
    descripcion  VARCHAR(1500) NOT NULL,
    solucion     VARCHAR(1500),
    estado       VARCHAR(20)   NOT NULL DEFAULT 'ABIERTO'
                 CHECK (estado IN ('ABIERTO', 'RESUELTO')),
    usuario_id   BIGINT        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tareas_usuario    ON tareas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_problemas_usuario ON problemas(usuario_id);
