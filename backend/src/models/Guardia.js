//Definir qué datos debe tener cada guardia obligatoriamente
const mongoose = require('mongoose');

const GuardiaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: String, enum: ['activo', 'inactivo', 'alerta'], default: 'activo' },
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  ultimaActualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guardia', GuardiaSchema);