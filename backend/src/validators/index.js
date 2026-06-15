// ============================================
// VALIDADORES (reglas de validación del lado del BACKEND)
// Usamos express-validator. Cada arreglo es una lista de reglas
// que se aplican como middleware antes de llegar al controlador.
// ============================================
const { body } = require('express-validator');

// --- Registro de usuario ---
const reglasRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .trim()
    .isEmail().withMessage('El email no es válido'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// --- Login ---
const reglasLogin = [
  body('email').trim().isEmail().withMessage('El email no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

// --- Crear / actualizar producto ---
const reglasProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
  body('categoria')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('La categoría no es válida'),
];

module.exports = { reglasRegistro, reglasLogin, reglasProducto };
