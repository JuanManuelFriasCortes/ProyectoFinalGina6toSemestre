// ============================================
// MIDDLEWARES de autenticación y autorización
// ============================================
// - verificarToken: protege rutas. Lee el JWT del header Authorization,
//   lo valida y guarda los datos del usuario en req.usuario.
// - soloAdmin: autorización por rol. Solo deja pasar a usuarios admin.
//
// FLUJO: el cliente manda  Authorization: Bearer <token>  en cada
// petición a una ruta protegida. Si el token es válido, continúa;
// si no, responde 401 (no autenticado) o 403 (sin permiso).
// ============================================
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- Verifica que venga un token válido (autenticación) ---
function verificarToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos los datos del token para usarlos en los controladores
    req.usuario = decoded; // { id, nombre, rol }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
}

// --- Verifica que el usuario sea admin (autorización) ---
function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'Acceso solo para administradores' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
