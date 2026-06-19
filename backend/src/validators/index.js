// ============================================
// VALIDADORES (reglas de validación del lado del BACKEND)
// Usamos express-validator. Cada arreglo es una lista de reglas
// que se aplican como middleware antes de llegar al controlador.
// ============================================
const { body } = require('express-validator');

// Helpers reutilizables para no repetir lógica entre body() y body('items[*]')
function esArrayNoVacio(valor) {
  return Array.isArray(valor) && valor.length > 0;
}

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

// --- Crear pedido ---
// body esperado: { items: [ { producto_id: 1, cantidad: 2 }, ... ] }
const reglasPedido = [
  body('items')
    .custom(esArrayNoVacio)
    .withMessage('El pedido debe incluir al menos un producto'),

  // Validamos cada elemento del arreglo "items" individualmente.
  // body('items.*.campo') le dice a express-validator: "revisa este
  // campo en TODOS los objetos del arreglo items", no solo en el primero.
  body('items.*.producto_id')
    .notEmpty().withMessage('Cada producto del pedido necesita un producto_id')
    .isInt({ gt: 0 }).withMessage('producto_id debe ser un número entero válido'),

  body('items.*.cantidad')
    .notEmpty().withMessage('Cada producto del pedido necesita una cantidad')
    .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
];

module.exports = { reglasRegistro, reglasLogin, reglasProducto, reglasPedido };