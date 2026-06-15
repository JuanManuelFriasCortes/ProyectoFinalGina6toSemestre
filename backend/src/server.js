// ============================================
// SERVIDOR PRINCIPAL - Cafetería MOMO
// Arquitectura: server -> routes -> controllers -> (middlewares) -> db
// ============================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

// --- Middlewares globales ---
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // permite peticiones del frontend
app.use(express.json()); // parsea el body JSON de las peticiones

// --- Ruta de salud (para probar que el server vive) ---
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API de MOMO funcionando ☕' });
});

// --- Montaje de las rutas (APIs REST) ---
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// --- Arranque ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor MOMO corriendo en http://localhost:${PORT}`);
});
