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
