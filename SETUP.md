# ⚙️ SETUP — Instalación, Base de Datos (Neon) y Email (SMTP)

Este documento explica cómo configurar el proyecto **localmente** y **en producción**, incluyendo base de datos PostgreSQL en **Neon** y envío de correos vía **SMTP (Gmail)**.

---

## ✅ Requisitos

- Node.js **18+**
- Cuenta en **Neon** (PostgreSQL)
- Cuenta **Gmail / Google Workspace** (para SMTP)
- Cuenta en **Vercel** (deploy)

---

## 🛠️ Instalación local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Variables de entorno

Crea un archivo **`.env.local`** en la raíz del proyecto:

```env
# Base de datos (Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# SMTP (Formulario de contacto)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=produccionesbiosfera@gmail.com
SMTP_PASS=TU_APP_PASSWORD_GENERADA

# Correos
CONTACT_TO=produccionesbiosfera@gmail.com
CONTACT_FROM="Biosfera Contacto <produccionesbiosfera@gmail.com>"
```

⚠️ **Nunca subas este archivo al repositorio.**

### 4️⃣ Ejecutar la aplicación

```bash
npm run dev
```

La app estará disponible en:

```
http://localhost:3000
```

---

## 🗄️ Base de Datos — Neon (PostgreSQL)

### 1️⃣ Crear proyecto en Neon

1. Entra a https://neon.tech
2. Crea un proyecto nuevo
3. Selecciona una región cercana
4. Copia el **connection string**
5. Pégalo en `DATABASE_URL`

Ejemplo:

```env
DATABASE_URL=postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require
```

### 2️⃣ Crear tabla `events`

Ejecuta lo siguiente en el **SQL Editor de Neon**:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  title TEXT,
  venue TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📬 Email — Configuración SMTP (Gmail)

### 🔎 ¿Cómo funciona el envío?

- El servidor envía correos usando **SMTP_USER**
- El correo del usuario se envía como **Reply-To**
- Al responder el email, respondes directamente al usuario

> Gmail **no permite** enviar correos desde emails externos (anti-spoofing)

---

### 🔐 Generar App Password en Google

Requisitos:

- Verificación en dos pasos activada

Pasos:

1. Ve a https://myaccount.google.com/security
2. Activa **Verificación en dos pasos**
3. Entra a **Contraseñas de aplicaciones**
4. Selecciona:
   - App: **Mail**
   - Dispositivo: **Other**
5. Copia la contraseña de 16 caracteres

Ejemplo:

```env
SMTP_PASS=abcd efgh ijkl mnop
```

⚠️ **No uses tu contraseña normal de Gmail.**

---

## ☁️ Deploy en Vercel

1. Sube el proyecto a GitHub
2. Ve a https://vercel.com
3. **Add New → Project**
4. Importa el repositorio
5. Configura las variables de entorno (mismas que `.env.local`)
6. Deploy 🚀

---

## ✅ Checklist final

- [ ] `.env.local` creado y NO subido
- [ ] `.env.example` existe en el repo
- [ ] Tabla `events` creada en Neon
- [ ] SMTP con App Password configurado
- [ ] Variables configuradas en Vercel
- [ ] Deploy exitoso
