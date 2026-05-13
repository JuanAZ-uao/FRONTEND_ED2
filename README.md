# EDA2_F - Concertix Frontend

Frontend construido con React + TypeScript y arquitectura MVC.

## Stack

- React 18
- TypeScript
- Vite
- React Router DOM

## Estructura MVC

- src/models: Interfaces y tipos de dominio (eventos, usuario, pagos).
- src/services: Acceso a datos y reglas de negocio desacopladas de la UI.
- src/controllers: Hooks controladores que orquestan estado, acciones y calculos.
- src/views: Componentes visuales, layouts y paginas.

## Rutas principales

- /: Home Desktop
- /event/:slug: Detalle del evento
- /auth: Login y registro
- /checkout: Compra de entradas
- /payment: Pago con tarjeta
- /dashboard: Dashboard usuario
- /forgot-password: Recuperacion
- /profile: Perfil
- /mobile: Home Mobile

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test:unit
npm run test:functional
```

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `VITE_API_URL` | URL publica del backend en Railway (ej: `https://tu-api.up.railway.app`) |

## Deploy en Vercel

1. Conecta este repositorio (EDA2_F) en Vercel.
2. En Project Settings > Environment Variables agrega `VITE_API_URL` con la URL de Railway.
3. Deploy con la configuracion incluida en `vercel.json`:
	- Build command: `npm run build`
	- Output directory: `dist`
	- Rewrites SPA hacia `index.html` para rutas de React Router.
