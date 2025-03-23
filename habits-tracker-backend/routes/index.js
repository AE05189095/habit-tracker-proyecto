var express = require('express');
var router = express.Router();
var habitosRouter = require('./habitos'); // Asegúrate de que la ruta sea correcta
const Habit = require('../models/Habit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Asegúrate de que las rutas de hábitos están registradas correctamente
router.use('/habitos', habitosRouter); // Esto carga todas las rutas de 'habitos.js'

// Ruta PATCH para marcar hábito como hecho
router.patch('/habits/markasdone/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    habit.lastDone = new Date();
    if (timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24) {
      habit.days += 1;
      habit.lastUpdate = new Date();
      await habit.save();
      res.status(200).json({ message: 'Hábito marcado como hecho' });
    } else {
      habit.days = 1;
      habit.lastUpdate = new Date();
      await habit.save();
      res.status(200).json({ message: 'Hábito reiniciado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el hábito', error: err });
  }
});

// Función para calcular la diferencia de horas entre dos fechas
const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 60 * 60); // Convertir milisegundos a horas
};

module.exports = router;



