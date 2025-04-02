const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Aseguramos que el nombre de usuario sea único
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true }); // Esto añade `createdAt` y `updatedAt` automáticamente

module.exports = mongoose.model('User', userSchema);





