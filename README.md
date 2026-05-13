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
```
