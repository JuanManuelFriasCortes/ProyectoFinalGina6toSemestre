// ============================================
// PÁGINA: PanelAdmin (SOLO admin)
// CRUD completo: ALTA, BAJA, CAMBIO, CONSULTA.
// Layout de 2 columnas: formulario "Nuevo producto" a la IZQUIERDA (sidebar),
// grid de productos a la DERECHA.
// Demuestra: useState, useEffect (carga + recarga), formulario
// controlado + validaciones, eventos, props, estados de éxito/error,
// async/await, consumo de API, renderizado de listas y condicional.
// ============================================
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import Mensaje from '../components/Mensaje';

const ICONO_POR_CATEGORIA = { cafe: '☕', pan: '🥐', postre: '🍰', general: '✦' };
const NOMBRE_CATEGORIA = { cafe: 'Café', pan: 'Pan', postre: 'Postre', general: 'General' };

// ---------- Subcomponente: tarjeta de producto en el grid ----------
function TarjetaAdmin({ producto, onEditar, onEliminar }) {
  const { nombre, descripcion, categoria, precio, disponible } = producto;
  return (
    <div className="pa-card">
      <div className="pa-card__icono" aria-hidden>{ICONO_POR_CATEGORIA[categoria] || '✦'}</div>

      <h4 className="pa-card__nombre">{nombre}</h4>
      <p className="pa-card__cat">{NOMBRE_CATEGORIA[categoria] || categoria}</p>
      {descripcion ? <p className="pa-card__desc">{descripcion}</p> : null}

      <div className="pa-card__fila">
        <span className="pa-card__precio">${Number(precio).toFixed(2)}</span>
        {/* Renderizado condicional: estado de disponibilidad */}
        <span className={`pa-card__estado ${Number(disponible) ? 'ok' : 'no'}`}>
          {Number(disponible) ? 'Disponible' : 'Agotado'}
        </span>
      </div>

      <div className="pa-card__acciones">
        <button className="pa-btn pa-btn--editar" onClick={() => onEditar(producto)}>Editar</button>
        <button className="pa-btn pa-btn--eliminar" onClick={() => onEliminar(producto.id)}>Eliminar</button>
      </div>
    </div>
  );
}
TarjetaAdmin.propTypes = {
  producto: PropTypes.object.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

// ---------- Componente principal ----------
function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  // Formulario controlado para ALTA/CAMBIO
  const formVacio = { nombre: '', descripcion: '', categoria: 'cafe', precio: '', disponible: 1 };
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null); // null = alta, número = cambio

  // CONSULTA: cargar productos
  async function cargarProductos() {
    try {
      const { data } = await api.get('/productos');
      setProductos(data.productos);
    } catch {
      setError('No se pudieron cargar los productos');
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []); // montaje

  // Maneja cambios del formulario controlado
  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validarForm() {
    if (form.nombre.trim().length < 2) return 'El nombre es obligatorio';
    if (!form.precio || Number(form.precio) <= 0) return 'El precio debe ser mayor a 0';
    return '';
  }

  // ALTA o CAMBIO según editandoId
  async function manejarSubmit(e) {
    e.preventDefault();
    setExito('');
    setError('');

    const errorVal = validarForm();
    if (errorVal) {
      setError(errorVal);
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, form); // CAMBIO
        setExito('Producto actualizado');
      } else {
        await api.post('/productos', form); // ALTA
        setExito('Producto creado');
      }
      setForm(formVacio);
      setEditandoId(null);
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    }
  }

  // Preparar CAMBIO: llena el formulario
  function editarProducto(producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      precio: producto.precio,
      disponible: producto.disponible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // BAJA
  async function eliminarProducto(id) {
    setExito('');
    setError('');
    try {
      await api.delete(`/productos/${id}`);
      setExito('Producto eliminado');
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar');
    }
  }

  function cancelarEdicion() {
    setForm(formVacio);
    setEditandoId(null);
  }

  return (
    <div className="pa-root">
      <Estilos />

      <div className="pa-layout">
        {/* ---- SIDEBAR IZQUIERDA: Nuevo producto / Editar ---- */}
        <aside className="pa-sidebar">
          <h3 className="pa-sidebar__titulo">
            {editandoId ? '✎ Editar producto' : '+ Nuevo producto'}
          </h3>

          <form onSubmit={manejarSubmit} className="pa-form">
            <div className="pa-campo">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={manejarCambio} placeholder="Ej. Latte" />
            </div>
            <div className="pa-campo">
              <label>Descripción</label>
              <input name="descripcion" value={form.descripcion} onChange={manejarCambio} placeholder="Breve descripción" />
            </div>
            <div className="pa-campo">
              <label>Categoría</label>
              <select name="categoria" value={form.categoria} onChange={manejarCambio}>
                <option value="cafe">Café</option>
                <option value="pan">Pan</option>
                <option value="postre">Postre</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="pa-campo">
              <label>Precio</label>
              <input name="precio" type="number" step="0.01" value={form.precio} onChange={manejarCambio} placeholder="0.00" />
            </div>
            <div className="pa-campo">
              <label>Disponible</label>
              <select name="disponible" value={form.disponible} onChange={manejarCambio}>
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
            </div>

            <div className="pa-form-acciones">
              <button type="submit" className="pa-btn pa-btn--primario">
                {editandoId ? 'Guardar cambios' : 'Crear producto'}
              </button>
              {editandoId && (
                <button type="button" className="pa-btn pa-btn--gris" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <Mensaje tipo="exito" texto={exito} />
          <Mensaje tipo="error" texto={error} />
        </aside>

        {/* ---- CONTENIDO DERECHA: grid de productos ---- */}
        <section className="pa-contenido">
          <div className="pa-encabezado">
            <h2 className="pa-titulo">Menú</h2>
            <span className="pa-conteo">{productos.length} productos</span>
          </div>
          <div className="pa-linea" />

          {productos.length === 0 ? (
            <p className="pa-vacio">No hay productos registrados todavía.</p>
          ) : (
            <div className="pa-grid">
              {/* Renderizado de listas */}
              {productos.map((p) => (
                <TarjetaAdmin
                  key={p.id}
                  producto={p}
                  onEditar={editarProducto}
                  onEliminar={eliminarProducto}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------- Estilos ----------
function Estilos() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .pa-root {
        min-height: 100%;
        /* Mismo fondo que la página de Inicio (Rosegold Aura) */
        background: linear-gradient(135deg, #f2ebe2 0%, #e8e0d6 60%, #dcc8c0 100%);
        font-family: 'Cormorant Garamond', Georgia, serif; color: #5e4647;
        padding: 130px 22px 48px;
      }

      .pa-layout {
        display: grid; grid-template-columns: 300px 1fr; gap: 28px;
        max-width: 1180px; margin: 0 auto; align-items: start;
      }

      /* ---- Sidebar ---- */
      .pa-sidebar {
        background: #fbf7f1; border: 1px solid #e0d3c8;
        padding: 22px 22px 18px; position: sticky; top: 110px;
        box-shadow: 0 8px 20px rgba(94,70,71,.12);
      }
      .pa-sidebar__titulo {
        font-family: 'Playfair Display', serif; font-style: italic;
        margin: 0 0 18px; font-size: 22px; color: #a3556a;
      }
      .pa-form { display: flex; flex-direction: column; gap: 14px; }
      .pa-campo { display: flex; flex-direction: column; gap: 5px; }
      .pa-campo label { font-size: 12px; letter-spacing: .5px; text-transform: uppercase; color: #a8827c; }
      .pa-campo input, .pa-campo select {
        background: #fff; border: 1px solid #e0d3c8;
        color: #5e4647; padding: 10px 12px; font-family: inherit; font-size: 14px;
      }
      .pa-campo input:focus, .pa-campo select:focus { outline: none; border-color: #c98e92; }
      .pa-campo input::placeholder { color: #b8a9a2; }
      .pa-form-acciones { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

      .pa-btn {
        border: none; cursor: pointer; font-family: inherit; font-size: 13px;
        padding: 10px 18px; letter-spacing: .5px;
        transition: background .2s, transform .15s;
      }
      .pa-btn:hover { transform: translateY(-1px); }
      .pa-btn--primario { background: #a3556a; color: #fff; text-transform: uppercase; }
      .pa-btn--primario:hover { background: #8a4459; }
      .pa-btn--gris { background: #e0d3c8; color: #5e4647; }
      .pa-btn--gris:hover { background: #d3c2b6; }

      /* ---- Contenido ---- */
      .pa-encabezado { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      .pa-titulo {
        font-family: 'Playfair Display', serif; font-style: italic; font-weight: 600;
        font-size: 44px; color: #5e4647; margin: 0;
      }
      .pa-conteo { font-size: 14px; color: #a8827c; letter-spacing: .5px; }
      .pa-linea { height: 2px; background: #5e4647; opacity: .25; margin: 8px 0 24px; }
      .pa-vacio { color: #a8827c; font-style: italic; }

      .pa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

      .pa-card {
        background: #fbf7f1; padding: 20px 18px;
        text-align: center; box-shadow: 0 6px 16px rgba(94,70,71,.12);
        transition: transform .2s, box-shadow .2s;
        display: flex; flex-direction: column; align-items: center; gap: 4px;
      }
      .pa-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(94,70,71,.2); }
      .pa-card__icono {
        font-size: 36px; width: 84px; height: 84px; margin-bottom: 6px;
        display: grid; place-items: center; background: #e6cdb0; border-radius: 50%;
      }
      .pa-card__nombre {
        margin: 0; font-family: 'Playfair Display', serif; font-size: 18px; color: #5e4647;
      }
      .pa-card__cat {
        margin: 2px 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #a3556a;
      }
      .pa-card__desc { margin: 4px 0 6px; font-size: 13px; color: #9c7d76; font-style: italic; min-height: 18px; }
      .pa-card__fila { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .pa-card__precio { font-size: 18px; font-weight: bold; color: #a3556a; }
      .pa-card__estado { font-size: 10px; letter-spacing: .5px; text-transform: uppercase; padding: 3px 9px; color: #fff; }
      .pa-card__estado.ok { background: #6e9a78; }
      .pa-card__estado.no { background: #b5566a; }
      .pa-card__acciones { display: flex; gap: 8px; }
      .pa-btn--editar { background: #a8827c; color: #fff; }
      .pa-btn--editar:hover { background: #8a6d6a; }
      .pa-btn--eliminar { background: #b5566a; color: #fff; }
      .pa-btn--eliminar:hover { background: #97455a; }

      @media (max-width: 900px) {
        .pa-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 720px) {
        .pa-layout { grid-template-columns: 1fr; }
        .pa-sidebar { position: static; }
        .pa-grid { grid-template-columns: 1fr; }
      }
    `}</style>
    </>
  );
}

export default PanelAdmin;