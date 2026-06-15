// ============================================
// CONTROLADOR de PEDIDOS
// - crear: un usuario logueado arma un pedido con varios productos.
// - misPedidos: el usuario ve SOLO sus pedidos.
// - listarTodos: el admin ve TODOS los pedidos.
// - cambiarEstado: el admin cambia el estado (pendiente -> entregado...).
// Demuestra rutas protegidas + diferencia de acceso admin vs cliente.
// ============================================
const db = require('../config/db');

// POST /api/pedidos  -> usuario logueado crea un pedido
// body: { items: [ { producto_id, cantidad } ] }
async function crear(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, mensaje: 'El pedido no tiene productos' });
    }

    // 1) Creamos la cabecera del pedido con total 0 (lo calculamos después)
    const [cab] = await db.query(
      'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, 0, ?)',
      [usuarioId, 'pendiente']
    );
    const pedidoId = cab.insertId;

    // 2) Insertamos cada producto del detalle, calculando el total
    let total = 0;
    for (const item of items) {
      const [prod] = await db.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
      if (prod.length === 0) continue; // producto inexistente -> lo saltamos
      const precio = Number(prod[0].precio);
      const cantidad = Number(item.cantidad) || 1;
      total += precio * cantidad;

      await db.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unit) VALUES (?, ?, ?, ?)',
        [pedidoId, item.producto_id, cantidad, precio]
      );
    }

    // 3) Actualizamos el total del pedido
    await db.query('UPDATE pedidos SET total = ? WHERE id = ?', [total, pedidoId]);

    return res.status(201).json({ ok: true, mensaje: 'Pedido creado', pedidoId, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al crear el pedido' });
  }
}

// GET /api/pedidos/mios  -> el usuario logueado ve sus propios pedidos
async function misPedidos(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const [pedidos] = await db.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC',
      [usuarioId]
    );
    return res.json({ ok: true, pedidos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar tus pedidos' });
  }
}

// GET /api/pedidos  -> SOLO admin ve todos los pedidos (con nombre del cliente)
async function listarTodos(req, res) {
  try {
    const [pedidos] = await db.query(
      `SELECT p.*, u.nombre AS cliente, u.email
         FROM pedidos p
         JOIN usuarios u ON u.id = p.usuario_id
        ORDER BY p.id DESC`
    );
    return res.json({ ok: true, pedidos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar los pedidos' });
  }
}

// PUT /api/pedidos/:id/estado  -> SOLO admin cambia el estado
async function cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: 'Estado no válido' });
    }
    const [resultado] = await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }
    return res.json({ ok: true, mensaje: 'Estado actualizado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: 'Error al actualizar el estado' });
  }
}

module.exports = { crear, misPedidos, listarTodos, cambiarEstado };
