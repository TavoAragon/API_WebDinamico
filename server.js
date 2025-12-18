const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configurar CORS para permitir peticiones desde cualquier origen
app.use(cors());
app.use(bodyParser.json());

// Configurar Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false, // Puedes cambiar a true para ver logs de SQL
});

// Definir modelo de Tarea (Checklist)
const Tarea = sequelize.define("Tarea", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  prioridad: {
    type: DataTypes.ENUM("baja", "media", "alta"),
    defaultValue: "media",
  },
  categoria: {
    type: DataTypes.STRING,
    defaultValue: "general",
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Sincronizar base de datos
sequelize
  .sync({ force: false }) // Cambia a true para resetear la BD cada vez
  .then(() => {
    console.log("Base de datos sincronizada");
  })
  .catch((err) => {
    console.error("Error sincronizando BD:", err);
  });

// RUTAS DE LA API

// 1. Obtener todas las tareas
app.get("/api/tareas", async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      order: [["prioridad", "DESC"], ["fechaCreacion", "DESC"]],
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener una tarea por ID
app.get("/api/tareas/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (tarea) {
      res.json(tarea);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear una nueva tarea
app.post("/api/tareas", async (req, res) => {
  try {
    const tarea = await Tarea.create(req.body);
    res.status(201).json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Actualizar una tarea
app.put("/api/tareas/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (tarea) {
      await tarea.update(req.body);
      res.json(tarea);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Eliminar una tarea
app.delete("/api/tareas/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (tarea) {
      await tarea.destroy();
      res.json({ message: "Tarea eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Marcar tarea como completada/incompleta
app.patch("/api/tareas/:id/toggle", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      await tarea.save();
      res.json(tarea);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Obtener tareas por categoría
app.get("/api/tareas/categoria/:categoria", async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { categoria: req.params.categoria },
      order: [["prioridad", "DESC"], ["fechaCreacion", "DESC"]],
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Obtener tareas completadas
app.get("/api/tareas/completadas", async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { completada: true },
      order: [["fechaCreacion", "DESC"]],
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Obtener tareas pendientes
app.get("/api/tareas/pendientes", async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { completada: false },
      order: [["prioridad", "DESC"], ["fechaCreacion", "ASC"]],
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Eliminar todas las tareas completadas
app.delete("/api/tareas/completadas", async (req, res) => {
  try {
    await Tarea.destroy({
      where: { completada: true },
    });
    res.json({ message: "Tareas completadas eliminadas" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(` API de Checklist escuchando en: http://localhost:${port}`);
  console.log(`Endpoints disponibles:`);
  console.log(`   GET    http://localhost:${port}/api/tareas`);
  console.log(`   POST   http://localhost:${port}/api/tareas`);
  console.log(`   GET    http://localhost:${port}/api/tareas/:id`);
  console.log(`   PUT    http://localhost:${port}/api/tareas/:id`);
  console.log(`   DELETE http://localhost:${port}/api/tareas/:id`);
  console.log(`   PATCH  http://localhost:${port}/api/tareas/:id/toggle`);
});
