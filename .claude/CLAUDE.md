# Corazél Lencería — Contexto del proyecto

Este archivo es la fuente de verdad para cualquier sesión de Claude Code que trabaje en este repo. Léelo antes de tocar código.

## Qué es esto

E-commerce de una sola marca ("Corazél", tienda única — **no** multi-vendedor) de lencería femenina, mercado Colombia (COP). Referencia visual/UX original: https://divinamujerlenceria.com/ (solo inspiración de UX, no de marca).

## Modelo de negocio y MVP

- **Single-vendor.** Aunque el proyecto se llame "marketplace", es la tienda de una sola marca. El schema de base de datos debe quedar modelado para soportar un futuro marketplace multi-vendedor (entidad tipo `Seller`/`Store`, campos de comisión, etc.), pero **no** se construye la lógica ni UI multi-vendedor ahora. No pintar el schema en una esquina single-tenant.
- **MVP:** panel admin (carga de productos/categorías/colecciones/stock) + catálogo público con filtros + botón de WhatsApp con mensaje prellenado (producto, talla, color, cantidad) en vez de checkout con pago. **No hay pasarela de pago ni pedido persistido en BD en el MVP** — es un link de WhatsApp, no una orden registrada.
- **Prioridad #1: mobile.** La mayoría del tráfico es móvil. Todo se diseña mobile-first; desktop es la adaptación, no al revés.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Angular (standalone components) + Angular Material (admin) + Tailwind CSS (tienda pública) |
| Backend | NestJS + Prisma ORM (v6.x — **no** v7: el generador nuevo de Prisma 7 es ESM-only vía `import.meta.url` y no encaja con el NestJS estándar en CommonJS; usar `prisma-client-js` clásico con `url = env("DATABASE_URL")` directo en `schema.prisma`) |
| Base de datos | PostgreSQL |
| Imágenes | Cloudinary |
| Hosting objetivo | Nube administrada, free tier: frontend en Vercel, backend en Render, Postgres en Neon (ver `DEPLOYMENT.md` para la guía paso a paso) |

No cambiar de framework/ORM sin que el usuario lo pida explícitamente.

## Identidad de marca (obligatorio respetar al pie de la letra)

**Ortografía oficial: "Corazél"** (con tilde) para nombre de marca en UI/copy; el repo/paquetes usan "corazel" sin tilde por simplicidad técnica.

**Tagline:** «REALZA TU CUERPO, CELEBRA QUIÉN ERES.»

**Paleta de colores (hex):**
| Nombre | Hex | Uso |
|---|---|---|
| Rosa Corazél | `#E8B6C3` | fondos, banners, decorativo |
| Rosa pastel | `#F6DDE3` | fondo principal, tarjetas, secciones |
| Borgoña Corazél | `#641F32` | botones, títulos, menú, contraste (color de acción primario) |
| Marfil | `#FFF9F5` | fondo general |
| Beige champagne | `#D9C0B0` | fondos secundarios, estética premium |
| Dorado | `#C9A66B` | líneas, iconos, detalles decorativos |

Distribución sugerida: 60% tonos claros, 25% rosa, 10% borgoña, 5% dorado.

**Tipografía:** Cormorant Garamond (serif — títulos, nombres de colección, frases de campaña) + Montserrat (sans — cuerpo, menú, botones, precios, guía de tallas). Fuente manuscrita solo en detalles pequeños puntuales, opcional.

**Botones:**
- Primario: fondo borgoña `#641F32`, texto marfil `#FFF9F5` (ej. "COMPRAR AHORA").
- Secundario: fondo transparente, borde y texto borgoña (ej. "DESCUBRIR COLECCIÓN").

**Tono/estilo fotográfico:** elegante, femenino, sofisticado, acogedor — "boutique de lencería". Fondos beige claro/rosa pastel/champagne/borgoña suave; props: satinados, flores, labiales, espejos, perfumes, cintas, detalles dorados. El producto siempre protagonista, nunca explícito.

## Catálogo — taxonomía (dos ejes cruzados, independientes)

1. **Categoría** (tipo de prenda): sets, corsés, bodys, babydolls, pijamas, accesorios, panties, etc.
2. **Colección** (línea de marca, del manual de identidad):
   - **Aura** — energía, confianza y luz
   - **Afrodita** — sensualidad, amor propio y belleza
   - **Atenea** — fuerza, inteligencia y determinación
   - **Isis** — transformación, sabiduría y renacimiento

Un producto tiene AMBOS: una categoría y una colección (relaciones separadas, no una taxonomía fusionada).

**Tallas:** solo letras (XS, S, M, L, XL) para el MVP — no tallas numéricas de sujetador. Stock se controla por combinación talla × color por producto (variantes).

**Roles de admin:** un solo rol admin con acceso total en el MVP. No construir sistema de permisos granular todavía, pero no bloquear poder agregarlo después.

## Estándar de código (no negociable)

El usuario pidió explícitamente: carpetas bien organizadas, patrones de diseño claros, código limpio, y frontend modular/reutilizable por features.

### Backend (NestJS)
- Un módulo por concepto de dominio: `products`, `categories`, `collections`, `inventory`, `auth`, `uploads` (Cloudinary). Nada de mega-módulos.
- Controller solo orquesta (recibe request, llama service, retorna). Toda la lógica de negocio vive en el service.
- Prisma nunca se accede directo desde el controller — siempre a través de un service (patrón repositorio vía `PrismaService` inyectable).
- DTOs con `class-validator`/`class-transformer` para todo input; nunca confiar en el body crudo.
- Guards para proteger rutas de admin; interceptors para transformación de respuesta/logging; filters para manejo global de excepciones.

### Frontend (Angular)
- `core/` — servicios singleton (ApiService, AuthService, CartService), modelos TS, interceptors HTTP. Se usa una sola vez en toda la app.
- `shared/` — design system reutilizable: componentes presentacionales puros (button, product-card, size-selector, collection-badge, whatsapp-cta), pipes, directivas. Todo estilizado según la paleta/tipografía de marca de arriba. **Antes de crear un componente nuevo, revisar si ya existe uno en `shared/` que se pueda reutilizar/extender** — nunca duplicar markup/estilos de botón o tarjeta entre features.
- `features/` — cada feature (catalog, product-detail, cart, admin/*) es un módulo independiente que consume `shared/` y `core/`, nunca al revés.
- `layout/` — header, footer, bottom-nav mobile.
- Separar componentes "smart" (features, hablan con servicios/HTTP) de componentes "dumb" (shared, solo `@Input`/`@Output`).
- Standalone components. Preferir Angular signals para estado local antes que introducir una librería de estado global (NgRx) — no añadir esa complejidad a menos que el MVP realmente lo requiera.
- Mobile-first en Tailwind: se diseña primero para pantalla chica.

## Variables de entorno / datos pendientes

El usuario ya tiene o tendrá pronto el número de WhatsApp de ventas y el dominio — hasta que los comparta, usar placeholders vía variables de entorno, nunca hardcodeados en lógica de componente:
- Backend: `DATABASE_URL`, `CLOUDINARY_*`, `JWT_SECRET`
- Frontend: `WHATSAPP_SALES_NUMBER` (o `environment.ts`), `SITE_DOMAIN`

## Fuente de identidad visual

El PDF original con el manual de identidad de marca está en la raíz del repo: `Mini_Manual_Identidad_Visual_Corazel_final.pdf`. Consultarlo si hace falta más detalle del que está resumido aquí.
