# Checklist API

API completa para gestión de checklist de actividades diarias con CRUD completo y CORS habilitado.

## Características
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- CORS habilitado para peticiones desde cualquier origen
- Base de datos SQLite (no requiere instalación adicional)
- Endpoints para tareas completadas/pendientes
- Filtrado por categoría
- Prioridades (baja, media, alta)
- Interfaz web incluida para pruebas
- Script de pruebas para terminal

## Instalación

```bash
# 1. Clonar o crear proyecto
mkdir checklist-api
cd checklist-api

# 2. Inicializar proyecto
npm init -y

# 3. Instalar dependencias
npm install express sequelize sqlite3 cors body-parser

# 4. Crear archivo server.js con el código proporcionado
