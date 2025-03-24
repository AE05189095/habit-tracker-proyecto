var express = require('express');
var cors = require('cors');  // Requiere el paquete CORS
var router = express.Router();
var habitosRouter = require('./habitos');
const Habit = require('../models/Habit');

const app = express();

// Configura CORS para permitir solicitudes de cualquier origen
app.use(cors());  // Habilita CORS para todas las rutas

// Configura el middleware de Express para que pueda parsear JSON
app.use(express.json());  // Asegúrate de usar esto para parsear el cuerpo de las solicitudes

// Ruta para la página principal
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Ruta para obtener todos los hábitos
app.get('/habits', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving habits', error: err });
  }
});

// Ruta para crear un nuevo hábito
app.post('/habits', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const habit = new Habit({
      title,
      description,
      lastDone: null,
      lastUpdate: null,
      days: 0
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Error creating habit', error: err });
  }
});

// Ruta para eliminar un hábito
app.delete('/habits/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting habit', error: err });
  }
});

// Ruta PATCH para marcar un hábito como hecho
app.patch('/habits/markasdone/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const now = new Date();
    if (!habit.lastUpdate || timeDifferenceInHours(now, habit.lastUpdate) >= 24) {
      habit.days = 1; // Reiniciar la racha
    } else {
      habit.days += 1; // Incrementar la racha
    }

    habit.lastDone = now;
    habit.lastUpdate = now;
    await habit.save(); // Guardar cambios en MongoDB

    res.status(200).json({
      message: habit.days > 1 ? 'Habit marked as done' : 'Habit restarted',
      days: habit.days
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating habit', error: err.message });
  }
});

// Función para calcular la diferencia de horas entre dos fechas
const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 3600); // Convertir milisegundos a horas
};

// Función para calcular la diferencia de días entre dos fechas
const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24)); // Convertir milisegundos a días
};

module.exports = app;  // Asegúrate de exportar la aplicación principal, no solo el router






