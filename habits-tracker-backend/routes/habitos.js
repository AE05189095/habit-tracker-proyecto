const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Ruta para obtener todos los hábitos
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find();
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los hábitos', error: err });
    }
});

// Ruta para crear un nuevo hábito
router.post('/', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Título y descripción son requeridos' });
    }

    const habit = new Habit({
        title,
        description,
        lastDone: null,
        lastUpdate: null,
        days: 0
    });

    try {
        await habit.save();
        res.status(201).json(habit);
    } catch (err) {
        res.status(400).json({ message: 'Error al crear el hábito', error: err });
    }
});

// Ruta para eliminar un hábito
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findByIdAndDelete(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Hábito no encontrado' });
        }
        res.json({ message: 'Hábito eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el hábito', error: err });
    }
});

// Ruta para actualizar un hábito completamente
router.put('/:id', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Título y descripción son requeridos' });
    }

    try {
        const habit = await Habit.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );
        if (!habit) {
            return res.status(404).json({ message: 'Hábito no encontrado' });
        }
        res.json(habit);
    } catch (err) {
        res.status(400).json({ message: 'Error al actualizar el hábito', error: err });
    }
});

// Ruta PATCH para marcar hábito como hecho
router.patch('habitos/markasdone/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Hábito no encontrado' });
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
            message: habit.days > 1 ? 'Hábito marcado como hecho' : 'Hábito reiniciado',
            days: habit.days
        });

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

