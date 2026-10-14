# Despliegue (planes gratuitos)

Orden recomendado: **base de datos → backend → frontend → ajustar CORS**.

## 1. Base de datos: Neon (neon.tech) o Supabase
1. Crea un proyecto PostgreSQL.
2. Copia los datos de conexión: host, base, usuario y contraseña.
3. Arma la URL JDBC: `jdbc:postgresql://HOST/BASE?sslmode=require`
   (la URL `postgres://...` que muestran los paneles **no** sirve tal cual para Spring: debe empezar por `jdbc:postgresql://` y el usuario/clave van en variables aparte).

## 2. Backend: Render (render.com)
1. New → **Web Service** → conecta el repositorio de GitHub.
2. Root Directory: `backend` · Runtime: **Docker** (usa el `Dockerfile` incluido).
3. Variables de entorno:

| Variable | Valor |
|---|---|
| `DB_URL` | la URL JDBC del paso 1 |
| `DB_USER` | usuario de la base |
| `DB_PASSWORD` | contraseña de la base |
| `JWT_SECRET` | cadena aleatoria en Base64 (≥ 32 bytes). Generar: `openssl rand -base64 48` |
| `CORS_ORIGINS` | URL del frontend (se completa en el paso 4) |

4. Al terminar, prueba `https://TU-BACKEND.onrender.com/api/health`.
   En el plan gratuito el servicio "duerme" tras inactividad: la primera petición puede tardar ~1 minuto. Ábrelo antes de exponer.

## 3. Frontend: Vercel (vercel.com) o Netlify
1. Edita `frontend/src/environments/environment.ts` y pon `apiUrl: 'https://TU-BACKEND.onrender.com/api'`. Haz commit y push.
2. Importa el repositorio, Root Directory: `frontend`.
3. Vercel detecta `vercel.json` (build `npm run build`, salida `dist/frontend/browser`).
   En Netlify: build command `npm run build`, publish directory `dist/frontend/browser` (el archivo `public/_redirects` ya maneja las rutas de Angular).

## 4. CORS
Vuelve a Render y define `CORS_ORIGINS` con la URL final del frontend, sin barra final (ej. `https://taskflow.vercel.app`). Redespliega.

## Problemas frecuentes
- **"No se pudo conectar con el servidor"**: backend dormido o `apiUrl` incorrecta.
- **Error CORS en consola**: `CORS_ORIGINS` no coincide exactamente con la URL del frontend.
- **Falla la conexión a la BD**: falta `?sslmode=require` o la URL no empieza con `jdbc:postgresql://`.
