// ============================================
// CONTROLADOR de AUTENTICACIÓN
// Maneja: registro y login.
// - register: hashea la contraseña con bcrypt y crea el usuario.
// - login: verifica credenciales y devuelve un JWT (token).
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Genera el token firmado con los datos mínimos del usuario
function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '2h' }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    // ¿Ya existe el email? (validación contra la BD)
    const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ ok: false, mensaje: 'Ese email ya está registrado' });
    }

    // Hasheamos la contraseña antes de guardarla
    const hash = await bcrypt.hash(password, 10);

    // Todos los registros nuevos son 'cliente' (el admin se crea por seed)
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, 'cliente']
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: resultado.insertId, nombre, email, rol: 'cliente' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error en el servidor' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [filas] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (filas.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    const usuario = filas[0];

    // Comparamos la contraseña enviada contra el hash guardado
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario);

    return res.json({
      ok: true,
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error en el servidor' });
  }
}

// GET /api/auth/perfil  (ruta protegida - devuelve el usuario del token)
async function perfil(req, res) {
  return res.json({ ok: true, usuario: req.usuario });
}

module.exports = { register, login, perfil };
