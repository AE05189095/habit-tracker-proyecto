require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/users');
const habitosRouter = require('./routes/habitos');

// Configuración de Express
const app = express();

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/habits-tracker';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? JSON.parse(process.env.ALLOWED_ORIGINS)
  : [
      'http://localhost:3000',
      'https://habits-tracker-89susewuf-angelo-estradas-projects.vercel.app',
      'https://habits-tracker-frontend.vercel.app'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Manejar explícitamente las peticiones OPTIONS
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= RUTAS ================= //

// Ruta raíz simplificada
app.get('/', (req, res) => {
  res.json({ title: "Express" });
});

// Ruta de salud
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'OK',
    db: dbStatus,
    uptime: process.uptime(),
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
    }
  });
});

// Rutas de API
app.use('/api/users', usersRouter);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token requerido',
      solution: 'Incluye un token JWT válido en el header Authorization'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido',
        details: err.message
      });
    }
    req.user = user;
    next();
  });
};

app.use('/api/habits', authenticateToken, habitosRouter);

// ================= MANEJO DE ERRORES ================= //

// 404 mejorado
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      root: '/',
      healthCheck: '/health',
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login'
      },
      habits: 'GET/POST/PUT/DELETE /api/habits (requiere autenticación)'
    }
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
});

// Cierre para entornos serverless
process.on('SIGTERM', () => {
  console.log('👋 Recibido SIGTERM. Cerrando servidor...');
  mongoose.connection.close(() => {
    console.log('🔴 MongoDB desconectado');
    process.exit(0);
  });
});

module.exports = app;