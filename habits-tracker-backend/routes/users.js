var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Ruta para el registro de usuario
router.post('/register', async function(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Faltan datos de usuario o contraseña' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('habitToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.status(201).json({ message: 'Usuario registrado correctamente', token });
  } catch (error) {
    console.log("Error en el registro:", error);  // Imprimir el error completo para más detalles
    res.status(500).json({ error: "Error en el registro", description: error.toString() });
  }
});

// Ruta para el login de usuario
router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('habitToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.log("Error en el login:", error);  // Imprimir el error completo para más detalles
    res.status(500).json({ error: "Error en el login", description: error.toString() });
  }
});

module.exports = router;




