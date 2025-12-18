# API de Checklist de Actividades Diarias

Una API RESTful para gestionar un checklist de actividades diarias, construida con Node.js, Express, Sequelize y SQLite. Esta API permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en tareas, con soporte para CORS.

## Características

- Operaciones CRUD completas para tareas
-  Base de datos SQLite (sin necesidad de servidor de base de datos externo)
-  CORS habilitado para peticiones desde cualquier origen
-  Campos adicionales como prioridad, categoría, estado de completado y fechas
-  Endpoints para filtrar tareas (completadas, pendientes, por categoría)
-  Alternar estado de completado de una tarea
-  Eliminar todas las tareas completadas
   Documentación completa y ejemplos de uso

## Tecnologías Utilizadas

- Node.js
- Express
- Sequelize (ORM)
- SQLite3
- CORS
- Body-parser
