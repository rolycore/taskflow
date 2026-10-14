# TaskFlow - Gestor de tareas

**Proyecto #2 - Entornos de Programación**
Universidad de Panamá · Centro Regional Universitario de Coclé · Facultad de Informática, Electrónica y Comunicación
Profesora: Lilibeth Comparaz · Integrantes: _(nombre 1)_, _(nombre 2)_ · IDE con IA utilizado: _(IDE asignado)_

Aplicación web desarrollada con ayuda de un IDE con Inteligencia Artificial. Permite registrarse, iniciar sesión,
administrar tareas (crear, listar, editar y eliminar) y llevar un registro de **problemas y sus soluciones**.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular 18 (componentes standalone, signals, formularios reactivos), CSS responsive |
| Backend | Spring Boot 3.3, Java 17, Spring Security + JWT, Bean Validation |
| Base de datos | PostgreSQL |
| Arquitectura | MVC por capas: `controller` → `service` → `repository` → `model`, con DTOs |

## Estructura

```
taskflow/
├── backend/    API REST (Spring Boot)
├── frontend/   Aplicación Angular
├── database/   schema.sql (opcional, la API crea las tablas sola)
└── docs/       Bitácora de IA, comparación del IDE, guía de presentación y despliegue
```

## Ejecutar en local

### 1. Requisitos
Java 17+, Maven 3.9+ (o el wrapper de tu IDE), Node.js 18.19+ / 20+, PostgreSQL 14+.

### 2. Base de datos
```bash
psql -U postgres -c "CREATE DATABASE taskflow;"
```
Las tablas se crean automáticamente al iniciar la API. Si prefieres crearlas a mano: `psql -U postgres -d taskflow -f database/schema.sql`.

### 3. Backend
```bash
cd backend
mvn spring-boot:run
```
Por defecto usa `postgres` / `postgres` en `localhost:5432`. Para cambiarlo, define variables de entorno:
`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS`.
Comprobar: http://localhost:8080/api/health → `{"status":"UP"}`

### 4. Frontend
```bash
cd frontend
npm install
npm start
```
Abrir http://localhost:4200

## API REST

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Crear cuenta | No |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) | No |
| GET | `/api/tareas` | Listar mis tareas | Sí |
| POST | `/api/tareas` | Crear tarea | Sí |
| PUT | `/api/tareas/{id}` | Editar tarea | Sí |
| DELETE | `/api/tareas/{id}` | Eliminar tarea | Sí |
| GET/POST/PUT/DELETE | `/api/problemas[/{id}]` | CRUD de problemas y soluciones | Sí |

Cada usuario solo accede a sus propios datos. Contraseñas con BCrypt; sesión sin estado con JWT.

## Despliegue

Ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

## Uso de IA en el desarrollo

Ver [`docs/BITACORA_IA.md`](docs/BITACORA_IA.md) y [`docs/COMPARACION_IDE.md`](docs/COMPARACION_IDE.md).
