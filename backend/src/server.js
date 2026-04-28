const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Guardia = require('./models/Guardia');


const app = express();
app.use(cors());
app.use(express.json());// Permitir que el servidor entienda datos en formato JSON

// Conectarse a la base de datos (MongoDB/Atlas)
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(error => console.error('❌ Error de conexión a MongoDB:', error));


// RUTA: Actualizar ubicación del guardia
app.post('/api/guardia/ubicacion', async (req, res) => {
  try {
    const { guardiaId, lat, lng } = req.body;

    const guardia = await Guardia.findById(guardiaId);

    if (!guardia) {
      return res.status(404).json({ mensaje: "Guardia no encontrado" });
    }

    // Actualizamos la ubicación
    guardia.ubicacion.lat = lat;
    guardia.ubicacion.lng = lng;
    guardia.ultimaActualizacion = new Date();

    // Guardamos en la BD
    await guardia.save();

    res.json({ mensaje: "Ubicación actualizada correctamente" });
  } catch (error) {
    console.error("Error actualizando ubicación:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});


// RUTA PARA VER TODOS LOS GUARDIAS
app.get('/api/guardias', async (req, res) => {
  const guardias = await Guardia.find();
  res.json(guardias);
});

app.get('/', (req, res) => res.json({ mensaje: "API de Seguridad con MongoDB Activa" }));


// RUTA: Recibir alerta de pánico
app.post('/api/panico', (req, res) => {
  const { guardiaId, ubicacion } = req.body;

  console.log(`⚠️ ALERTA RECIBIDA del Guardia: ${guardiaId}`);
  console.log(`📍 Ubicación: Lat ${ubicacion.lat}, Lng ${ubicacion.lng}`);

  res.status(201).json({
    mensaje: "Alerta recibida en central, ayuda en camino.",
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.send('Servidor de Seguridad Activo');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Seguridad corriendo en puerto ${PORT}`);
});