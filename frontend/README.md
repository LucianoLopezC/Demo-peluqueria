# Peluquería 1 — Frontend

SPA en React 19 + Vite con landing pública y panel privado para profesionales.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (tokens de diseño en `src/estilos/global.css`, estética mármol/griego minimalista)
- React Router
- Axios (`src/api/`)

## Desarrollo

```bash
cp .env.example .env   # ajustar VITE_URL_BASE_API si el backend corre en otro puerto
npm install
npm run iniciar
```

## Estructura

```
src/
  paginas/publico/      Landing pública
  paginas/panel/        Panel privado (profesionales)
  componentes/publico/   Secciones de la landing
  componentes/panel/     Componentes del panel
  componentes/comunes/   Primitivas del design system
  api/                   Clientes Axios por recurso
  enrutador/             Definición de rutas públicas/privadas
  contexto/              Contexto de autenticación
```
