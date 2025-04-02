const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/users');
const habitosRouter = require('./routes/habitos');

const app = express();
dotenv.config();

// 🔍 Verificar que las variables de entorno están cargadas
console.log('📢 MONGO_URI:', process.env.MONGO_URI);
console.log('📢 JWT_SECRET:', process.env.JWT_SECRET ? 'Cargado' : 'No encontrado'); // No imprimir el valor por seguridad

// Configurar CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.use(express.json());

// 🔐 Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("📢 Header Authorization recibido:", authHeader); // DEBUG
    
    const token = authHeader?.split(' ')[1];  // Extraer el token
    console.log("📢 Token extraído:", token); // DEBUG

    if (!token) {
        console.error("❌ No se envió el token");
        return res.status(403).json({ message: 'Acceso denegado: No se envió el token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("❌ Error verificando token:", err.message); // DEBUG
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.user = user;
        console.log("✅ Usuario autenticado:", user); // DEBUG
        next();
    });
};

// 🔗 Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1);
});

// 🚀 Rutas
app.use('/users', usersRouter);
app.use('/habits', authenticateToken, habitosRouter);

// Manejar errores
app.use((req, res, next) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});

module.exports = app;
