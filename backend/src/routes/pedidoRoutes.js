// ============================================
// RUTAS de pedidos  ->  /api/pedidos
// Todas requieren token. Algunas además requieren rol admin.
// ============================================
const express = require('express');
const router = express.Router();

const {
  crear, misPedidos, listarTodos, cambiarEstado,
} = require('../controllers/pedidoController');
const { reglasPedido } = require('../validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

// Usuario logueado (cliente o admin)
router.post('/', verificarToken, reglasPedido, validarCampos, crear);  // crear pedido (validado)
router.get('/mios', verificarToken, misPedidos);      // mis pedidos

// Solo admin
router.get('/', verificarToken, soloAdmin, listarTodos);            // todos los pedidos
router.put('/:id/estado', verificarToken, soloAdmin, cambiarEstado); // cambiar estado

module.exports = router;