// ============================================
// PÁGINA: PanelAdmin (SOLO admin)
// CRUD completo de productos: ALTA, BAJA, CAMBIO, CONSULTA.
// Aquí se ven en la interfaz las 4 operaciones que pide la rúbrica.
// Demuestra: useState, useEffect (carga + recarga), formulario
// controlado + validaciones, eventos, props (ProductoCard),
// estados de éxito/error, async/await, consumo de API.
// ============================================
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductoCard from '../components/ProductoCard';
import Mensaje from '../components/Mensaje';

function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  // Formulario controlado para ALTA/CAMBIO
  const formVacio = { nombre: '', descripcion: '', categoria: 'cafe', precio: '', disponible: 1 };
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null); // null = alta, número = cambio

  // CONSULTA: cargar productos al montar
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
        // CAMBIO
        await api.put(`/productos/${editandoId}`, form);
        setExito('Producto actualizado');
      } else {
        // ALTA
        await api.post('/productos', form);
        setExito('Producto creado');
      }
      setForm(formVacio);
      setEditandoId(null);
      cargarProductos(); // recargar lista
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    }
  }

  // Preparar CAMBIO: llena el formulario con el producto
  function editarProducto(producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      precio: producto.precio,
      disponible: producto.disponible,
    });
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

  return (
    <div>
      <h2>Panel de Administración</h2>

      {/* Formulario controlado: ALTA / CAMBIO */}
      <h3>{editandoId ? 'Editar producto (CAMBIO)' : 'Nuevo producto (ALTA)'}</h3>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre: </label>
          <input name="nombre" value={form.nombre} onChange={manejarCambio} />
        </div>
        <div>
          <label>Descripción: </label>
          <input name="descripcion" value={form.descripcion} onChange={manejarCambio} />
        </div>
        <div>
          <label>Categoría: </label>
          <select name="categoria" value={form.categoria} onChange={manejarCambio}>
            <option value="cafe">Café</option>
            <option value="pan">Pan</option>
            <option value="postre">Postre</option>
            <option value="general">General</option>
          </select>
        </div>
        <div>
          <label>Precio: </label>
          <input name="precio" type="number" value={form.precio} onChange={manejarCambio} />
        </div>
        <div>
          <label>Disponible: </label>
          <select name="disponible" value={form.disponible} onChange={manejarCambio}>
            <option value={1}>Sí</option>
            <option value={0}>No</option>
          </select>
        </div>
        <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear producto'}</button>
        {editandoId && (
          <button type="button" onClick={() => { setForm(formVacio); setEditandoId(null); }}>
            Cancelar edición
          </button>
        )}
      </form>

      <Mensaje tipo="exito" texto={exito} />
      <Mensaje tipo="error" texto={error} />

      {/* CONSULTA + acciones de CAMBIO/BAJA */}
      <h3>Productos registrados (CONSULTA)</h3>
      {productos.map((p) => (
        <ProductoCard
          key={p.id}
          producto={p}
          onEditar={editarProducto}
          onEliminar={eliminarProducto}
        />
      ))}
    </div>
  );
}

export default PanelAdmin;
