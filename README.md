# Corazel Lencería

E-commerce de una sola marca (lencería femenina, Colombia). Ver [.claude/CLAUDE.md](.claude/CLAUDE.md) para el contexto completo del negocio, identidad de marca y estándares de código — léelo antes de tocar el código.

Para poner esto en producción gratis (Vercel + Render + Neon + Cloudinary), ver [DEPLOYMENT.md](DEPLOYMENT.md).

## Stack

- **Frontend:** Angular 20 (standalone) + Angular Material (panel admin) + Tailwind CSS 4 (tienda pública)
- **Backend:** NestJS + Prisma 6 (`prisma-client-js`)
- **Base de datos:** PostgreSQL
- **Imágenes:** Cloudinary

## Estructura

```
backend/    API NestJS (módulos: auth, categories, collections, products, uploads)
frontend/   Angular (core / shared / features / layout)
```

## Requisitos previos

- Node.js 22+
- PostgreSQL corriendo localmente (o una URL de conexión administrada)

## Backend

```bash
cd backend
npm install                 # ya instalado si vienes del setup inicial
cp .env.example .env        # completa DATABASE_URL, CLOUDINARY_*, WHATSAPP_SALES_NUMBER
npx prisma migrate dev      # crea las tablas
npx prisma db seed          # admin + colecciones + categorías base
npm run start:dev           # http://localhost:3000/api
```

Credenciales de admin sembradas por defecto (cámbialas tras el primer login, o define `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` antes de sembrar):

- Email: `admin@corazel.com`
- Password: `CambiarEsta123!`

## Frontend

```bash
cd frontend
npm install                 # ya instalado si vienes del setup inicial
npm start                   # http://localhost:4200
```

Configuración de entorno en `src/environments/environment.ts` (`apiUrl`, `whatsappSalesNumber`).

## Pendiente por parte del negocio

- Número real de WhatsApp de ventas (`WHATSAPP_SALES_NUMBER` en el backend y `whatsappSalesNumber` en `environment.ts`)
- Credenciales de Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- Dominio final de producción

## Notas de diseño

- El negocio es **single-vendor** (una sola marca). El schema de Prisma incluye un modelo `Seller` para que la base de datos quede lista para un futuro marketplace multi-vendedor, pero no hay UI/lógica multi-vendedor en el MVP.
- El MVP no tiene pasarela de pago: el carrito genera un link de WhatsApp con el pedido prellenado (`WhatsappService` en el frontend).
- Mobile-first en toda la tienda pública (bottom-nav fijo, filtros deslizables, imágenes optimizadas vía Cloudinary).
