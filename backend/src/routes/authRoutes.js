// ============================================
// RUTAS de autenticación  ->  /api/auth
// ============================================
const express = require('express');
const router = express.Router();

const { register, login, perfil } = require('../controllers/authController');
const { reglasRegistro, reglasLogin } = require('../validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { verificarToken } = require('../middlewares/auth');

// Públicas
router.post('/register', reglasRegistro, validarCampos, register);
router.post('/login', reglasLogin, validarCampos, login);

// Protegida (necesita token) -> devuelve el perfil del usuario logueado
router.get('/perfil', verificarToken, perfil);

module.exports = router;
