// ============================================
// CONTROLADOR de PRODUCTOS (el menú de MOMO)
// Aquí están las 4 operaciones que pide la rúbrica:
//   ALTA    -> crear
//   BAJA    -> eliminar
//   CAMBIO  -> actualizar
//   CONSULTA-> listar / obtener por id
// ============================================
const db = require('../config/db');

// GET /api/productos  -> CONSULTA (lista todos)
// Pública: la usa hasta el visitante NO logueado para ver el menú.
async function listar(req, res) {
  try {
    // Soporta query param ?categoria=cafe (filtro opcional)
    const { categoria } = req.query;
    let sql = 'SELECT * FROM productos';
    const params = [];
    if (categoria) {
      sql += ' WHERE categoria = ?';
      params.push(categoria);
    }
    sql += ' ORDER BY id DESC';

    const [productos] = await db.query(sql, params);
    return res.json({ ok: true, productos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar productos' });
  }
}

// GET /api/productos/:id  -> CONSULTA (uno solo, usa ruta con parámetro)
async function obtenerUno(req, res) {
  try {
    const { id } = req.params;
    const [filas] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (filas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }
    return res.json({ ok: true, producto: filas[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar el producto' });
  }
}

// POST /api/productos  -> ALTA (solo admin)
async function crear(req, res) {
  try {
    const { nombre, descripcion = '', categoria = 'general', precio, disponible = 1 } = req.body;
    const [resultado] = await db.query(
      'INSERT INTO productos (nombre, descripcion, categoria, precio, disponible) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, categoria, precio, disponible]
    );
    return res.status(201).json({
      ok: true,
      mensaje: 'Producto creado',
      producto: { id: resultado.insertId, nombre, descripcion, categoria, precio, disponible },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al crear el producto' });
  }
}

// PUT /api/productos/:id  -> CAMBIO (solo admin)
async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, precio, disponible } = req.body;

    const [resultado] = await db.query(
      `UPDATE productos
         SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, disponible = ?
       WHERE id = ?`,
      [nombre, descripcion, categoria, precio, disponible, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }
    return res.json({ ok: true, mensaje: 'Producto actualizado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al actualizar el producto' });
  }
}

// DELETE /api/productos/:id  -> BAJA (solo admin)
async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }
    return res.json({ ok: true, mensaje: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al eliminar el producto' });
  }
}

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };
