# Mini-mercado-cafe

Aplicación web móvil para gestionar pedidos de un mini-mercado en un conjunto residencial.  
Incluye catálogo público, carrito básico y generación de pedidos vía WhatsApp, además de un panel administrativo para controlar inventario, ventas y métodos de pago.

## Tecnologías
- React + Vite
- Tailwind CSS
- Supabase (Auth, PostgreSQL, Storage)
- Vercel (Frontend Hosting)
- GitHub (Control de versiones)

## Requisitos previos
- Node.js versión LTS (18+)
- pnpm o npm
- Git
- Cuenta en Supabase
- Cuenta en Vercel
- WhatsApp en el dispositivo móvil

## Estructura del proyecto
Mini-mercado-cafe/
├─ frontend/ # App React (catalogo + admin)
├─ infra/ # Configuraciones de infraestructura, migraciones, scripts
└─ docs/ # Documentación


## Instrucciones de desarrollo
1. Clonar el repositorio:
git clone https://github.com/Juan-camilo-GM/Mini-mercado-cafe.git
css
Copiar código

2. Instalar dependencias del frontend (cuando el código esté creado):
cd frontend
pnpm install


3. Crear archivo `.env` usando `.env.example` (lo generaremos más adelante).

4. Ejecutar entorno de desarrollo:
pnpm dev

nginx

## Estado del proyecto
Este proyecto está en la **fase inicial (Sprint 0)**.  
La funcionalidad principal aún no se ha construido.

2. Crea docs/dev-setup.md
En la carpeta docs/, crea ese archivo con este contenido:

docs/dev-setup.md

# Configuración de Desarrollo

Guía rápida para preparar el entorno de desarrollo del proyecto Mini-mercado-cafe.

## 1. Requisitos previos
- Node.js LTS (18 o superior)
- pnpm o npm
- Git
- Editor recomendado: VS Code
- Extensiones sugeridas:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## 2. Clonar el repositorio
git clone https://github.com/Juan-camilo-GM/Mini-mercado-cafe.git
cd Mini-mercado-cafe


## 3. Crear la estructura inicial
La estructura base del proyecto es:
Mini-mercado-cafe/
├─ frontend/
├─ infra/
└─ docs/


(Ya creada en Sprint 0.)

## 4. Variables de entorno
El archivo `.env.example` con las variables necesarias se generará más adelante cuando configuremos Supabase y Vite.

## 5. Ejecutar el proyecto (cuando frontend esté creado)
cd frontend
pnpm install
pnpm dev


## 6. Git workflow
- `main`: rama estable / producción.
- `dev`: rama de integración.
- ramas por feature: `feat/<nombre-corto>`
