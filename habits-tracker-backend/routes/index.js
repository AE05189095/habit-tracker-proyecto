// routes/index.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    }
    
    const token = authHeader.split(' ')[1]; // Extrae el token sin "Bearer"
    if (!token) {
        return res.status(401).json({ error: "Formato de token incorrecto." });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado", message: err.message });
        }
        req.user = user;
        console.log("Token verificado, usuario:", req.user); // Debugging
        next();
    });
};

module.exports = { authenticateToken };














