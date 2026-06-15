// ============================================
// MIDDLEWARE: recoge los errores de express-validator
// ============================================
// Los validators (carpeta /validators) definen las reglas.
// Este middleware revisa si alguna regla falló y, de ser así,
// corta la petición devolviendo 400 con la lista de errores.
// ============================================
const { validationResult } = require('express-validator');

function validarCampos(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map((e) => ({ campo: e.path, error: e.msg })),
    });
  }
  next();
}

module.exports = { validarCampos };
