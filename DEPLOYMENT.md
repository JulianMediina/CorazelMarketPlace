# Despliegue de Corazél — guía detallada (100% gratis, 100% dashboards)

Nada de esto requiere terminal ni comandos de consola de tu parte. Todo se hace haciendo clic en Neon, Render, Vercel y Cloudinary, pegando bloques de variables de entorno. El único paso "técnico" (correr migraciones y sembrar los datos iniciales: colecciones, categorías, admin) queda dentro del **Build Command de Render**, así que corre solo en cada deploy — no hay que ejecutar nada a mano.

Orden obligatorio: **1. Neon → 2. Cloudinary → 3. Render → 4. Vercel** (cada paso necesita un dato del anterior).

Plantillas listas para copiar (ya están en el repo, en `.gitignore` para que nunca subas valores reales):
- `backend/.env.render.example` → cópialo a `backend/.env.render`, complétalo, pégalo en Render.
- `frontend/.env.vercel.example` → cópialo a `frontend/.env.vercel`, complétalo, pégalo en Vercel.

---

## 1. Neon — base de datos PostgreSQL

### 1.1 Crear la cuenta y el proyecto

1. Entra a **https://console.neon.tech** y crea la cuenta (puedes usar "Continue with GitHub").
2. Si es tu primer proyecto, Neon te lleva directo al formulario de creación. Si ya tienes otros proyectos, botón **"New Project"** (arriba a la derecha del listado de proyectos).
3. Formulario de creación:
   - **Project name**: `corazel`
   - **Postgres version**: deja la que viene por defecto (la más reciente).
   - **Region**: elige la más cercana a Colombia — de las disponibles en el free tier, `AWS US East (N. Virginia)` suele ser la de mejor latencia.
4. Click **Create Project**. Neon crea automáticamente una base de datos (nombre por defecto `neondb`) y un usuario (nombre por defecto `neondb_owner` o similar).

### 1.2 Encontrar las connection strings

Neon no te da host/usuario/password sueltos: te da una **connection string** completa (`postgresql://...`), y necesitas **dos versiones** de la misma:

1. Apenas creas el proyecto, caes en el **Project Dashboard**. Ahí mismo, en la parte superior, hay un panel llamado **"Connection string"** (si no lo ves, en el menú lateral izquierdo es la primera opción, ícono de enchufe, dice **"Connect"** o **"Dashboard"**).
2. Dentro de ese panel hay:
   - Un dropdown **"Branch"** → deja `main` (o `production`, el que venga por defecto).
   - Un dropdown **"Database"** → deja el que venga por defecto.
   - Un dropdown **"Role"** → deja el que venga por defecto.
   - Un **toggle/checkbox que dice "Pooled connection"** (a veces aparece como "Connection pooling"). Este toggle es la clave:
     - **Con el toggle ACTIVADO**: el host de la connection string tiene `-pooler` antes del dominio (ej. `ep-abc-123-pooler.us-east-1.aws.neon.tech`). **Copia este valor → es tu `DATABASE_URL`.**
     - **Con el toggle DESACTIVADO**: el mismo host pero sin `-pooler` (ej. `ep-abc-123.us-east-1.aws.neon.tech`). **Copia este valor → es tu `DIRECT_URL`.**
3. Hay un botón de copiar (ícono de portapapeles) al lado de la connection string — úsalo para no transcribir mal el password (es un password generado, no lo vas a memorizar).
4. Guarda las dos strings en un lugar temporal (un bloc de notas), las vas a pegar en Render en el paso 3. Se ven así:

```
postgresql://neondb_owner:AbC123xYz@ep-abc-123-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
postgresql://neondb_owner:AbC123xYz@ep-abc-123.us-east-1.aws.neon.tech/neondb?sslmode=require
```

   (Mismo usuario y password en ambas, solo cambia el host por la presencia o no de `-pooler`.)

> Por qué dos: la *pooled* la usa el backend en producción (aguanta muchas conexiones cortas simultáneas). La *direct* la necesitan las migraciones de Prisma (`prisma migrate deploy`), que no funcionan bien a través del pooler. `backend/prisma/schema.prisma` ya está configurado para usar `DATABASE_URL` (pooled) en runtime y `DIRECT_URL` (direct) solo para migrar — no hay que tocar ese archivo.

> Si en vez de Neon prefieres Supabase: Project Settings → Database → "Connection string", ahí el toggle equivalente se llama "Use connection pooling" (puerto `6543` = pooled/`DATABASE_URL`, puerto `5432` = direct/`DIRECT_URL`).

No hay nada más que hacer en Neon por ahora — las tablas las crea Render automáticamente en el primer deploy (paso 3).

---

## 2. Cloudinary — almacenamiento de imágenes

1. Entra a **https://cloudinary.com/users/register_free** y crea la cuenta.
2. Tras confirmar el email, caes en el **Console / Dashboard** (`https://console.cloudinary.com`).
3. En la página principal del dashboard hay un panel llamado **"Product Environment Credentials"** (o simplemente aparece arriba del todo, debajo del saludo con tu nombre). Ahí ves tres campos:
   - **Cloud name** — visible directamente.
   - **API Key** — visible directamente.
   - **API Secret** — aparece oculto como `••••••••`, con un ícono de ojo 👁 al lado para revelarlo. Haz clic ahí para verlo, y en el ícono de copiar para copiarlo.
4. Guarda los tres valores en el mismo bloc de notas temporal — van al mismo bloque de Render en el siguiente paso.

⚠️ **Nunca pegues estos tres valores en ningún archivo del repo ni en un chat/documento que se vaya a subir a git.** Van únicamente en el bloque de variables de entorno de Render (paso 3), que no se commitea. Si alguna vez quedan expuestos por accidente, revócalos de inmediato desde este mismo dashboard (ícono de "regenerar" junto al API Secret).

---

## 3. Render — backend (API NestJS)

### 3.1 Crear el servicio

1. Entra a **https://dashboard.render.com** y crea la cuenta (recomendado: "Continue with GitHub", así el paso 2 queda hecho).
2. Botón **"New +"** (arriba a la derecha) → **"Web Service"**.
3. Si es la primera vez, Render pide autorizar acceso a tu cuenta de GitHub → autoriza y da acceso al repositorio `CorazelMarketPlace` (puedes dar acceso a "All repositories" o solo a ese, como prefieras).
4. En la lista de repos que aparece, busca `CorazelMarketPlace` y click **"Connect"**.

### 3.2 Configurar el servicio

En el formulario que aparece, completa exactamente:

| Campo | Valor |
|---|---|
| **Name** | `corazel-backend` (o el que quieras, define tu URL: `<name>.onrender.com`) |
| **Region** | la más cercana disponible |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma migrate deploy && npx prisma db seed && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Instance Type** | **Free** |

   El Build Command hace **todo el trabajo de base de datos automáticamente en cada deploy**: instala dependencias, crea/actualiza las tablas (`migrate deploy`), y siembra colecciones + categorías + el usuario admin (`db seed`, usa `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` de las variables de entorno de abajo). Es idempotente — puedes redeployar mil veces que no duplica nada ni te resetea la contraseña del admin si ya la cambiaste.

### 3.3 Variables de entorno (pegar el bloque completo)

**No llenes los campos uno por uno.** Antes de crear el servicio (o después, en la pestaña **Environment**), busca el botón **"Add from .env"** (está junto a "Add Environment Variable", arriba de la lista de variables) — abre un cuadro de texto donde puedes **pegar un bloque completo** y Render lo separa solo en variables individuales.

1. En tu proyecto, copia `backend/.env.render.example` a `backend/.env.render`.
2. Completa ahí los valores reales (las dos connection strings de Neon del paso 1.2, los tres de Cloudinary del paso 2, y el resto — ver detalle de cada campo abajo).
3. Copia **todo el contenido** de `backend/.env.render` y pégalo en el cuadro "Add from .env" de Render.

Detalle de cada variable del bloque:

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | La *pooled* connection string de Neon (paso 1.2) |
| `DIRECT_URL` | La *direct* connection string de Neon (paso 1.2) |
| `JWT_SECRET` | Cualquier cadena larga y aleatoria (no tiene que salir de ningún lado, solo tiene que ser secreta e impredecible) |
| `JWT_EXPIRES_IN_SECONDS` | `604800` (7 días) — déjalo así salvo que quieras sesiones más cortas/largas |
| `CORS_ORIGIN` | La URL de Vercel — **este campo lo completas al final**, después del paso 4. Mientras tanto puedes dejar `https://localhost` como valor temporal |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Del paso 2 |
| `WHATSAPP_SALES_NUMBER` | Tu número de ventas en formato E.164 sin `+` (ej. `573001234567`) |
| `SEED_ADMIN_EMAIL` | El email con el que vas a entrar al panel `/admin/login` |
| `SEED_ADMIN_PASSWORD` | La contraseña de ese admin (mínimo 8 caracteres) |

   No agregues `PORT`: Render lo inyecta solo y el backend ya lo respeta automáticamente.

### 3.4 Deploy y verificación

1. Click **"Create Web Service"** (o si ya lo habías creado, **"Save Changes"** después de pegar las variables — esto redespliega solo).
2. Render muestra los logs del deploy en vivo. Deberías ver, en orden: instalación de dependencias → `Applying migration...` (Prisma) → `Seller de sistema listo` / `4 colecciones sembradas` / `7 categorías sembradas` / `Admin listo: ...` (tu seed) → build de Nest → `Your service is live`.
3. Anota la URL que te da Render, arriba del todo de la página del servicio: `https://corazel-backend.onrender.com` (o el nombre que hayas puesto).
4. Verifica en el navegador: `https://<tu-url>.onrender.com/api/health` debe mostrar `{"success":true,"data":{"status":"ok","service":"corazel-backend"}}`.

Si algo falla, la pestaña **"Logs"** del servicio (menú lateral izquierdo dentro del servicio) muestra el error exacto — casi siempre es una variable de entorno mal pegada (revisa que las connection strings de Neon no tengan saltos de línea de más).

---

## 4. Vercel — frontend (Angular)

El repo es un monorepo (`backend/` + `frontend/`), así que Vercel necesita saber que el proyecto real está dentro de `frontend/`. Eso se configura **una sola vez** al importar (campo "Root Directory"); de ahí en adelante `frontend/vercel.json` ya deja el build command, el output directory y la generación de `environment.prod.ts` en automático — lo único que tocas en cada deploy futuro son las variables de entorno.

### 4.1 Importar el proyecto

1. Entra a **https://vercel.com/new**.
2. Si es la primera vez, autoriza acceso a tu cuenta de GitHub.
3. En la lista de repositorios, busca `CorazelMarketPlace` → botón **"Import"**.
4. En la pantalla "Configure Project" que aparece:
   - **Root Directory**: click en **"Edit"** al lado del campo → selecciona/escribe `frontend` → confirma. Vercel suele detectarlo solo (por el `angular.json` que hay ahí) y sugerirlo automáticamente — si ya aparece `frontend` seleccionado, no hace falta tocarlo.
   - **Framework Preset**: con Root Directory en `frontend`, Vercel detecta "Angular" solo. No hace falta cambiarlo — `frontend/vercel.json` igual fuerza el build command real.
   - **Build and Output Settings**: no toques nada aquí, déjalos colapsados/por defecto (los toma de `frontend/vercel.json`).

### 4.2 Variables de entorno (pegar el bloque completo)

En esa misma pantalla de "Configure Project" hay una sección **"Environment Variables"** más abajo. Tiene un campo de texto donde puedes pegar contenido `.env` y Vercel lo detecta y separa solo en filas Key/Value (aparece un aviso tipo "Paste .env contents above and we'll parse them" o similar arriba del campo Key).

1. Copia `frontend/.env.vercel.example` a `frontend/.env.vercel`.
2. Complétalo:

```
API_URL=https://<tu-backend>.onrender.com/api
WHATSAPP_SALES_NUMBER=573001234567
```

   (`API_URL` es la URL de Render del paso 3.4 **+ `/api` al final** — es fácil olvidar el `/api`, sin eso el sitio no va a poder hablar con el backend.)

3. Pega ese contenido completo en el campo de Environment Variables. Si no ves el parser automático, pega cada línea manualmente: **Key** = `API_URL`, **Value** = tu URL; **Key** = `WHATSAPP_SALES_NUMBER`, **Value** = tu número.
4. Si ya habías importado el proyecto antes y estás agregando las variables después: **Settings → Environment Variables** (menú lateral izquierdo del proyecto) tiene el mismo campo de pegado.

### 4.3 Deploy y conectar con el backend

1. Click **"Deploy"**. Vercel muestra el progreso del build en vivo (debe ejecutar `cd frontend && npm install && npm run build:prod`).
2. Al terminar, te da la URL: `https://corazel-marketplace.vercel.app` (o similar, según el nombre del proyecto).
3. Vuelve a **Render → tu servicio → Environment**, edita `CORS_ORIGIN` reemplazando el valor temporal por esta URL real (sin `/` al final) → **Save Changes** (redespliega solo).
4. Abre la URL de Vercel y entra a `/catalogo`: si carga sin errores en la consola del navegador (F12 → pestaña Console, no debe haber errores en rojo de "CORS" o "Failed to fetch"), quedó todo conectado.

---

## 5. Checklist final

- [ ] `https://<backend>.onrender.com/api/health` responde `ok`
- [ ] `https://<frontend>.vercel.app` carga el inicio con la paleta de marca
- [ ] `/catalogo` muestra las 4 colecciones y las 7 categorías (confirma que el seed automático corrió)
- [ ] `/admin/login` funciona con el `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` que pegaste en Render
- [ ] Crear un producto de prueba con imagen desde el admin — aparece en Cloudinary → Media Library
- [ ] "Finalizar pedido por WhatsApp" abre WhatsApp con el mensaje prellenado al número correcto
- [ ] `CORS_ORIGIN` en Render apunta a la URL real de Vercel (no al valor temporal)

## 6. Qué esperar del free tier

- **Render**: el servicio se duerme tras ~15 minutos sin tráfico. El primer visitante después de eso espera ~30-50 segundos en el primer request (se ve como que el sitio "no carga" un rato — es normal, no está roto).
- **Neon**: se autosuspende tras inactividad prolongada; revive sola en el siguiente query, sin pérdida de datos, con unos segundos extra de espera.
- **Cloudinary free**: 25 créditos/mes, alcanza para un catálogo inicial de decenas de productos con varias fotos cada uno.

Nada de esto se arregla con código — son límites de infraestructura que se resuelven subiendo de plan en el dashboard correspondiente cuando haga falta.

## 7. Actualizar valores después del deploy (nuevo número, nuevo dominio, etc.)

Todo se cambia en dashboards, nunca en el repo:

- **Nuevo número de WhatsApp**: cambia `WHATSAPP_SALES_NUMBER` en Render *y* en Vercel (están duplicadas, una la usa el backend y otra el build del frontend) → guarda en ambos → cada uno redespliega solo.
- **Nuevo dominio propio**: Vercel → Settings → Domains → agrega el dominio, sigue las instrucciones de DNS que te da. Luego actualiza `CORS_ORIGIN` en Render y `API_URL` en Vercel con las URLs finales.
- **Rotar el JWT_SECRET o las credenciales de Cloudinary**: edítalas directo en Render → Environment → guarda. El backend las toma en el siguiente deploy/reinicio.
