# Despliegue gratuito de Corazél

Guía paso a paso para poner Corazél en producción usando **solo tiers gratuitos**: Neon (PostgreSQL), Render (backend) y Vercel (frontend). No se pide tarjeta de crédito en ninguno de los tres.

**Regla del proyecto: cero cambios de código en cada deploy.** Todo lo que cambia entre local y producción (URLs, credenciales, número de WhatsApp) vive en variables de entorno de cada proveedor — nunca se edita un archivo a mano para desplegar. El repo no tiene que tocarse otra vez salvo que cambie el código en sí.

## Arquitectura

```
┌─────────────┐      HTTPS       ┌──────────────┐   connection string   ┌─────────────┐
│   Vercel    │ ───────────────► │    Render    │ ─────────────────────►│    Neon     │
│  (Angular)  │  API_URL (env)   │  (NestJS API)│   DATABASE_URL/DIRECT_URL (env)      │
└─────────────┘                  └──────┬───────┘                       └─────────────┘
                                         │
                                         ▼
                                   ┌──────────┐
                                   │Cloudinary│ (imágenes de producto)
                                   └──────────┘
```

| Capa | Servicio | Config | Notas free tier |
|---|---|---|---|
| Base de datos | [Neon](https://neon.tech) | 100% por connection string (env vars) | Se autosuspende tras inactividad, revive sola en el siguiente query |
| Backend (NestJS) | [Render](https://render.com) | 100% por variables de entorno | Se duerme tras ~15 min sin tráfico; cold start ~30-50s |
| Frontend (Angular) | [Vercel](https://vercel.com) | 100% por variables de entorno (build genera el config, no se edita código) | Sin límite práctico para este tamaño de sitio |
| Imágenes | [Cloudinary](https://cloudinary.com) | 100% por variables de entorno | 25 créditos/mes |

Orden de setup: **Neon → Render → Vercel**, porque cada capa necesita una URL/credencial de la anterior.

---

## 0. Prerrequisitos

Código en GitHub (Vercel y Render se conectan por ahí):

```bash
git add -A
git commit -m "..."
git push
```

Cuentas gratis en [neon.tech](https://neon.tech), [render.com](https://render.com), [vercel.com](https://vercel.com), [cloudinary.com](https://cloudinary.com) (puedes usar tu cuenta de GitHub para las cuatro).

---

## 1. Neon — PostgreSQL vía connection string

Neon no usa usuario/password/host sueltos: todo se maneja como **connection string** (`postgresql://...`), y expone dos variantes que hay que usar en lugares distintos.

1. [console.neon.tech](https://console.neon.tech) → **New Project** → nombre `corazel`, región más cercana a Colombia (`AWS us-east-1` suele ser la disponible más rápida en el free tier).
2. Ve a **Connect** (o **Dashboard → Connection Details**). Ahí Neon te da un selector con dos modos:
   - **Pooled connection** (toggle "Connection pooling" activado / host con sufijo `-pooler`): úsala como `DATABASE_URL`. Es la que usa la app en runtime — soporta muchas conexiones cortas simultáneas, ideal para un backend serverless-friendly como Render.
   - **Direct connection** (mismo host sin `-pooler`): úsala como `DIRECT_URL`. Las migraciones de Prisma (`prisma migrate deploy`) necesitan esta conexión directa, sin pooler de por medio.
3. Las dos se ven así (mismo usuario/password/db, host distinto):

```
DATABASE_URL="postgresql://usuario:password@ep-xxxx-pooler.us-east-1.aws.neon.tech/corazel?sslmode=require"
DIRECT_URL="postgresql://usuario:password@ep-xxxx.us-east-1.aws.neon.tech/corazel?sslmode=require"
```

4. No hace falta tocar `backend/prisma/schema.prisma`: ya está preparado para este patrón —

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled, runtime
  directUrl = env("DIRECT_URL")     // directa, solo migraciones
}
```

Guarda ambas connection strings — van directo a las variables de entorno de Render en el siguiente paso, nunca a un archivo del repo.

> Si en vez de Neon usas Supabase, el mismo patrón aplica: su pooler vive en el puerto `6543` y la conexión directa en el `5432`. `DATABASE_URL`/`DIRECT_URL` se completan igual.

---

## 2. Cloudinary

1. Crea la cuenta en [cloudinary.com](https://cloudinary.com/users/register_free).
2. En el **Dashboard** copia `Cloud name`, `API Key` y `API Secret` — van como variables de entorno en Render (paso 3). **Nunca los pegues en este archivo ni en ningún otro del repo**: son credenciales reales, no placeholders.

---

## 3. Backend — Render

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service** → conecta el repo.
2. Configuración:

| Campo | Valor |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npx prisma migrate deploy && npm run build` |
| Start Command | `npm run start:prod` |
| Instance Type | **Free** |

   `npm install` ya dispara `prisma generate` solo (`postinstall` en `package.json`).

3. Pestaña **Environment** → variables (todas van acá, ninguna se commitea):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | pooled de Neon (paso 1) |
| `DIRECT_URL` | direct de Neon (paso 1) |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `JWT_EXPIRES_IN_SECONDS` | `604800` |
| `CORS_ORIGIN` | URL de Vercel (la agregas en el paso 4, después de crearla) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | del paso 2 |
| `WHATSAPP_SALES_NUMBER` | formato E.164 sin `+`, ej. `573001234567` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | solo se usan al correr el seed (paso 3.5), no en runtime |

   `PORT` no lo definas: Render lo inyecta solo y el backend ya lo respeta.

4. **Create Web Service**. Primer deploy corre la migración contra Neon y compila. Anota la URL, ej. `https://corazel-backend.onrender.com`.
5. Verifica: `https://corazel-backend.onrender.com/api/health` → `{"success":true,"data":{"status":"ok",...}}`.
6. Siembra los datos iniciales **una vez**, apuntando a Neon desde tu máquina (no se toca ningún archivo, solo variables de entorno en la terminal):

```bash
cd backend
DATABASE_URL="<pooled de Neon>" DIRECT_URL="<direct de Neon>" \
SEED_ADMIN_EMAIL="tu-email@real.com" SEED_ADMIN_PASSWORD="unaClaveFuerte123!" \
npx prisma db seed
```

   PowerShell: una línea por variable con `$env:NOMBRE="valor"` antes del `npx prisma db seed`.

---

## 4. Frontend — Vercel

En Vercel **lo único que configuras a mano son las dos variables de entorno**. Todo lo demás (dónde está el proyecto dentro del monorepo, el comando de build, la carpeta de salida, generar `environment.prod.ts`) ya está resuelto por `vercel.json` en la **raíz del repo** — no hace falta tocar "Root Directory", "Build Command" ni "Output Directory" en el dashboard, Vercel los toma de ahí solo:

```json
// vercel.json (raíz del repo)
{
  "buildCommand": "cd frontend && npm install && npm run build:prod",
  "outputDirectory": "frontend/dist/frontend/browser"
}
```

`npm run build:prod` a su vez corre `frontend/scripts/set-env.js`, que genera `environment.prod.ts` a partir de las variables de entorno del build. No se edita ningún archivo del repo para desplegar ni para actualizar esos valores.

1. [vercel.com/new](https://vercel.com/new) → **Import** el repo. Deja el Root Directory por defecto (la raíz) — no lo cambies.
2. Pestaña **Settings → Environment Variables**, agrega solamente estas dos:

| Variable | Valor |
|---|---|
| `API_URL` | URL del backend en Render **+ `/api`**, ej. `https://corazel-backend.onrender.com/api` |
| `WHATSAPP_SALES_NUMBER` | mismo número que pusiste en Render, ej. `573001234567` |

   Si falta alguna, el build falla con un mensaje claro (`[set-env] Faltan variables de entorno requeridas: ...`) en vez de desplegar algo roto en silencio.

3. **Deploy**. Vercel te da una URL tipo `https://corazel-marketplace.vercel.app`.
4. Vuelve a Render → **Environment** → actualiza `CORS_ORIGIN` con esa URL (sin slash final) → guarda (redespliega solo).

Cada vez que cambies `API_URL` o `WHATSAPP_SALES_NUMBER` a futuro (nuevo dominio, nuevo número de ventas), lo haces en **Vercel → Environment Variables** y disparas un redeploy — nunca editando `environment.prod.ts` a mano, porque el build lo vuelve a generar y lo pisaría.

---

## 5. Checklist final

- [ ] `https://<backend>.onrender.com/api/health` responde `ok`
- [ ] `https://<frontend>.vercel.app` carga el inicio con la paleta de marca
- [ ] `/catalogo` muestra categorías y colecciones (confirma que el seed corrió contra Neon)
- [ ] Login en `/admin/login` funciona con `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`
- [ ] Crear un producto de prueba con imagen desde el admin — aparece en Cloudinary Media Library
- [ ] "Finalizar pedido por WhatsApp" abre WhatsApp con el mensaje prellenado al número correcto
- [ ] Cambiar la contraseña del admin sembrado

## 6. Qué esperar del free tier

- **Render** duerme el backend tras ~15 min sin tráfico; el primer request tras eso tarda ~30-50s.
- **Neon** se autosuspende tras inactividad prolongada; revive sola en el siguiente query, sin pérdida de datos.
- **Cloudinary free** alcanza para un catálogo inicial de decenas de productos con varias fotos cada uno.

Nada de esto requiere cambios de código — son límites de infraestructura que se resuelven con un upgrade de plan cuando haga falta, sin tocar el repo.

## 7. Dominio propio (opcional)

1. **Vercel**: Project Settings → Domains → agrega tu dominio, sigue las instrucciones de DNS.
2. **Render**: Settings → Custom Domain si quieres `api.tudominio.com` en vez de `onrender.com`.
3. Actualiza `CORS_ORIGIN` (Render) y `API_URL` (Vercel) con los dominios finales — variables de entorno, no código — y redeploy.
