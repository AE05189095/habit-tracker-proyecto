var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', async function(req, res, next){
  try{
    const { username, password } = req.body;

    
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
      sameSite: 'None' 
    });

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el registro", description: error.toString() });
  }
});


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
      sameSite: 'None' 
    });

    res.json({ message: "Inicio de sesión exitoso", token });

  } catch (error) {
    res.status(500).json({ error: "Error en el login", description: error.toString() });
  }
});

module.exports = router;
