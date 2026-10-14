# Guía de presentación (20 pts)

Duración sugerida: 10-12 minutos. Ambos integrantes deben hablar.

| Min | Contenido | Responsable |
|---|---|---|
| 0-1 | Presentación del equipo, objetivo y tecnologías | Integrante 1 |
| 1-3 | Arquitectura: diagrama Angular ↔ API REST ↔ PostgreSQL, capas MVC | Integrante 1 |
| 3-7 | **Demo en vivo** (guion abajo) | Integrante 2 |
| 7-9 | Recorrido por el código: una entidad, un controlador, el servicio, un componente Angular | Integrante 1 |
| 9-11 | Uso del IDE con IA: 2-3 ejemplos reales (prompt → resultado → corrección) | Integrante 2 |
| 11-12 | Comparación del IDE, conclusiones y preguntas | Ambos |

## Guion de la demo
1. Abrir la app **desplegada** (despertar el backend antes de empezar).
2. Registrar un usuario nuevo → entra directo a Tareas.
3. Crear 3 tareas con distinta prioridad y estado; mostrar el filtro por estado y los contadores.
4. Editar una tarea (cambiar a "Completada") y eliminar otra.
5. Ir a **Problemas**: reportar uno, luego editarlo agregando la solución y marcarlo "Resuelto".
6. Cerrar sesión; intentar abrir `/tareas` → redirige a login (ruta protegida).
7. Mostrar en la base de datos (Neon/pgAdmin) las filas creadas y la contraseña con hash BCrypt.
8. Mostrar la app en vista móvil (herramientas de desarrollador, F12 → modo dispositivo).

## Preguntas que suelen hacer
- ¿Cómo se protege la contraseña? → BCrypt; nunca se guarda en texto plano.
- ¿Cómo sabe la API quién es el usuario? → Token JWT firmado en cada petición (`Authorization: Bearer`).
- ¿Por qué un usuario no ve las tareas de otro? → Las consultas filtran por el correo del token.
- ¿Qué error te dio la IA y cómo lo resolviste? → Ten un ejemplo real preparado.

## Lista de verificación antes de exponer
- [ ] App desplegada y probada el mismo día
- [ ] Repositorio de GitHub público (o con acceso para la profesora), con commits de ambos
- [ ] README con nombres, IDE y enlaces
- [ ] Bitácora de IA y comparación del IDE completadas
- [ ] Datos de prueba ya cargados por si falla el internet
