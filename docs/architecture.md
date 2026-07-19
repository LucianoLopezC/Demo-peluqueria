# Arquitectura

## Backend — capas explícitas

```
rutas/          → define endpoints HTTP y aplica intermediarios (auth, validación, rate limit)
controladores/  → traduce request/response HTTP, sin lógica de negocio
servicios/      → lógica de negocio (reglas de disponibilidad, auth, reservas, cache, logs)
repositorios/   → única capa que toca Prisma / bases de datos
```

Cada recurso (`servicios`, `profesionales`, `reservas`, `autenticacion`, `panel`) sigue el mismo
flujo: `rutas/*.rutas.js` → `controladores/*.controlador.js` → `servicios/*.servicio.js` →
`repositorios/*.repositorio.js`. Los controladores nunca llaman a Prisma directamente, y los
repositorios nunca conocen `req`/`res`.

### Módulo de disponibilidad (`servicios/disponibilidad/`)

- `disponibilidad.reglas.js`: funciones **puras**, sin I/O, sin `new Date()` interno (reciben
  `ahora` como parámetro). Contienen toda la lógica de negocio: solapamiento de horarios,
  validación de horario laboral, ajuste de duración. Se desarrollaron con TDD (33 casos de test
  antes de la implementación).
- `disponibilidad.servicio.js`: orquestador con I/O — llama a los repositorios, ejecuta las reglas
  puras, y envuelve el cache de Redis.

Esta separación (reglas puras vs. orquestador con I/O) es la que permite testear toda la lógica de
negocio sin mocks ni base de datos.

### Auth

- **JWT** (acceso 15 min + refresco 7 días) para el panel de profesionales. El token de refresco se
  guarda como hash en la tabla `TokenRefresco` y rota en cada uso.
- **Sesión-cookie + CSRF (double-submit-cookie)** para el flujo de reserva de invitados — nunca se
  usa para autorización, solo para anclar el token CSRF.
- Ambos mecanismos conviven en la misma app sin mezclarse: `autenticacion.jwt` protege
  `/api/panel/*`; `autenticacion.sesion` + `csrf` protegen `POST /api/reservas`.

### Redis (Upstash) y MongoDB (Atlas)

Ambos son capas secundarias, aisladas detrás de `cache.servicio.js` y
`registroActividad.servicio.js` respectivamente — el resto del código depende de esas interfaces,
no de los SDKs directamente. Si no están configurados (o no responden), el sistema falla de forma
segura: el cache se recalcula desde Postgres y el rate limiter permite la request en vez de
romperla.

## Frontend

```
paginas/publico/       Landing pública (una sola página con secciones)
paginas/panel/         Panel privado (protegido por RutaProtegida + ContextoAutenticacion)
componentes/publico/   Secciones de la landing
componentes/panel/     Componentes del panel (citas, cliente, horario)
componentes/comunes/   Primitivas del design system (mármol/griego/B&N)
api/                   Un cliente Axios por recurso, sobre un clienteAxios compartido
```

El `clienteAxios` centraliza dos mecanismos: adjunta el token CSRF leído de cookie en cada request,
y adjunta el token de acceso JWT en memoria; ante un 401 intenta renovar la sesión una vez antes de
reintentar la request original.
