# 🎧 DJ Portfolio & Agenda System

Plataforma web profesional diseñada para DJs, artistas y proyectos musicales, donde se combina **presencia digital**, **agenda de eventos** y **contacto directo** en una sola experiencia moderna, elegante y enfocada en la música.

Este sistema permite:

- Mostrar información del DJ (bio / proyecto artístico)
- Visualizar **eventos próximos** en una agenda dinámica
- Recibir **mensajes de contacto** directamente desde el sitio
- Administrar eventos desde un **panel privado (Backstage)**

---

## ✨ Características principales

### 🧑‍🎤 Perfil del DJ

- Sección informativa tipo blog / landing
- Presentación del proyecto artístico
- Enlaces a redes sociales
- Diseño visual moderno, oscuro y enfocado en la música electrónica

### 📅 Agenda de eventos

- Visualización de **próximos eventos**
- Clasificación por tipo:
  - Privados
  - Clubs
  - Festivales
- Carruseles horizontales optimizados para desktop y mobile
- Eventos filtrados automáticamente **desde la fecha actual en adelante**
- Estados de evento:
  - Reservado
  - Tentativo

### 🛠️ Backstage (Panel de administración)

- Crear nuevos eventos
- Eliminar eventos con confirmación visual
- Estadísticas rápidas:
  - Total de eventos
  - Reservados
  - Pendientes
- Interfaz privada pensada para gestión rápida y clara

### 📬 Formulario de contacto

- Formulario funcional con envío de correo real
- Validaciones visuales (toasts)
- Envío directo al correo del DJ
- Integración vía SMTP (Gmail / proveedor externo)

---

## 🧰 Tech Stack

### Frontend

- **Next.js (App Router)**
- **React**
- **Material UI (MUI)**
- **Framer Motion** (animaciones)
- Diseño responsive (mobile-first)

### Backend

- **Next.js API Routes**
- **PostgreSQL**

### Base de datos

- **Neon** (PostgreSQL serverless)
- Queries optimizadas
- Manejo correcto de fechas por día
- Zona horaria: `America/Mexico_City`

### Infraestructura & Deploy

- **Vercel**
- Variables de entorno seguras
- Deploy automático desde GitHub

---

## 🗄️ Base de datos

La aplicación utiliza **PostgreSQL** alojado en **Neon**, lo que permite:

- Escalabilidad
- Bajo mantenimiento
- Excelente integración con Vercel

### Estructura principal de la tabla de eventos

```sql
CREATE TABLE events (
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

## 📈 Escalabilidad

El sistema está preparado para crecer e integrar:

- Autenticación
- Roles (admin / artista)
- Múltiples DJs o proyectos
- Integración con calendarios externos
- CMS o panel administrativo extendido

---

## 🧠 Notas finales

Este proyecto fue diseñado con enfoque en:

- Experiencia visual profesional
- Performance
- Escalabilidad
- Buenas prácticas de seguridad
- Infraestructura moderna y serverless
