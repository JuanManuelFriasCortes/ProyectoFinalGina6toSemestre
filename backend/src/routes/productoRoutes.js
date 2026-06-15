// ============================================
// RUTAS de productos  ->  /api/productos
// CONSULTA es pública (la ve hasta el visitante sin login).
// ALTA / CAMBIO / BAJA son protegidas y SOLO admin.
// ============================================
const express = require('express');
const router = express.Router();

const {
  listar, obtenerUno, crear, actualizar, eliminar,
} = require('../controllers/productoController');
const { reglasProducto } = require('../validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

// --- Públicas (CONSULTA) ---
router.get('/', listar);            // GET /api/productos
router.get('/:id', obtenerUno);     // GET /api/productos/5

// --- Protegidas + solo admin (ALTA, CAMBIO, BAJA) ---
router.post('/', verificarToken, soloAdmin, reglasProducto, validarCampos, crear);
router.put('/:id', verificarToken, soloAdmin, reglasProducto, validarCampos, actualizar);
router.delete('/:id', verificarToken, soloAdmin, eliminar);

module.exports = router;
