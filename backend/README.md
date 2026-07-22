# Peluquería 1 — Backend

API en Express con arquitectura por capas (`rutas → controladores → servicios → repositorios`) y
Prisma ORM. Ver `../docs/architecture.md` para el detalle de diseño.

## Setup

1. Copiar el archivo de entorno:

   ```bash
   cp .env.example .env
   ```

2. Crear las cuentas gratuitas necesarias y completar `.env`:
   - **Postgres**: proyecto gratis en [Supabase](https://supabase.com) → en
     _Project Settings → Database → Connection string_ copiar:
     - **Transaction pooler** (puerto 6543) → `URL_BASE_DATOS` (la usa la app en runtime).
     - **Direct connection** (puerto 5432) → `URL_DIRECTA` (la usa solo `prisma migrate`/`db push`).
   - **Redis** (cache de disponibilidad + rate limiting): base gratis en
     [Upstash](https://upstash.com) → `URL_REST_UPSTASH_REDIS` y `TOKEN_REST_UPSTASH_REDIS`.
   - **MongoDB** (historial de notificaciones/logs): cluster M0 gratis en
     [MongoDB Atlas](https://www.mongodb.com/atlas) → `URI_MONGODB`.

   El sistema funciona sin Redis/Mongo configurados (cae de forma segura: sin cache, sin logs),
   pero **requiere** `URL_BASE_DATOS`/`URL_DIRECTA` para cualquier endpoint que toque datos.

3. Instalar dependencias y generar el cliente Prisma (desde la raíz del repo):

   ```bash
   npm install
   npm run prisma:generar --workspace=backend
   npm run prisma:migrar --workspace=backend    # crea la migración inicial contra tu Supabase
   npm run prisma:semilla --workspace=backend   # carga servicios y usuarios de ejemplo
   ```

4. Levantar el servidor:

   ```bash
   npm run iniciar:backend
   ```

## Tests

```bash
npm test --workspace=backend
```

Los tests unitarios (reglas de disponibilidad, sanitización, rate limiter) no requieren base de
datos. Los tests de integración que tocan Postgres necesitan `URL_BASE_DATOS` apuntando a una base
real (Supabase o la que definas).

## Usuarios de ejemplo (tras correr la semilla)

| Email                       | Password    | Rol         |
| --------------------------- | ----------- | ----------- |
| duena@peluqueria1.com       | changeme123 | PROPIETARIO |
| profesional@peluqueria1.com | changeme123 | PROFESIONAL |
| camila@peluqueria1.com      | changeme123 | PROFESIONAL |
| diego@peluqueria1.com       | changeme123 | PROFESIONAL |

## Modo demo

El botón "Entrar en modo demo" del login (`/panel/iniciar-sesion`) inicia sesión sin contraseña
como `profesional@peluqueria1.com`. Es una cuenta compartida por todos los visitantes: cualquier
reserva, cancelación u horario que editen queda visible para el resto hasta el próximo reinicio.

Cada 24 horas, Vercel Cron llama a `GET /api/demo/reiniciar`, que borra reservas, clientes y
tokens de refresco, restaura los horarios laborales de todo el staff a 09:00–18:00 (con descanso
13:00–14:00) y limpia los logs de actividad/notificaciones en Mongo. El endpoint solo acepta la
llamada si el header `Authorization` trae `Bearer <CRON_SECRET>`; **`CRON_SECRET` debe llamarse
exactamente así** porque es el nombre que Vercel exige para inyectar ese header automáticamente
en cada invocación programada (configurar el valor en las variables de entorno del proyecto en
Vercel, no solo en `.env` local). El cron está definido en `../vercel.json`.
