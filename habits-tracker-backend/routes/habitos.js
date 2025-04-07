var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');

// Ruta para obtener los hábitos de un usuario
router.get('/', async function (req, res, next) {
    try {
        // Se asume que el `req.user` ya está disponible por la autenticación global en `app.js`
        if (!req.user) {
            return res.status(403).json({ error: 'No autenticado' });  // Verificar si el usuario está autenticado
        }

        const habits = await Habit.find({ userId: req.user.userId });
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los hábitos" });
    }
});

// Ruta para agregar un hábito
router.post('/', async function (req, res, next) {
    try {
        const { title, description } = req.body;
        const habit = new Habit({
            userId: req.user.userId,
            title,
            description,
            createdAt: new Date()
        });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar hábito" });
    }
});

module.exports = router;
