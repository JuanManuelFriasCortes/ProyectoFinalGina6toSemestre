// ============================================
// PÁGINA: Menú (pública para ver; pedir requiere login)
// Demuestra: renderizado de listas, estados carga/éxito/error,
// QUERY PARAMS (filtro por categoría en la URL: /menu?categoria=cafe),
// consumo de API, useState, eventos, renderizado condicional.
// ============================================
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import ProductoCard from '../components/ProductoCard';
import Mensaje from '../components/Mensaje';

function Menu() {
  // QUERY PARAMS: leemos/escribimos ?categoria=... en la URL
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || '';

  const { estaLogueado } = useAuth();

  // useFetch (hook propio) maneja loading/success/error.
  // Cambia la url según el filtro -> dispara la ACTUALIZACIÓN del efecto.
  const url = categoria ? `/productos?categoria=${categoria}` : '/productos';
  const { data, cargando, error } = useFetch(url);

  // Carrito local simple (estado local)
  const [carrito, setCarrito] = useState([]);
  const [exitoPedido, setExitoPedido] = useState('');
  const [errorPedido, setErrorPedido] = useState('');

  function agregarAlCarrito(producto) {
    setCarrito((prev) => [...prev, producto]);
  }

  function cambiarCategoria(nuevaCategoria) {
    // Actualiza el query param en la URL
    if (nuevaCategoria) {
      setSearchParams({ categoria: nuevaCategoria });
    } else {
      setSearchParams({});
    }
  }

  async function confirmarPedido() {
    setExitoPedido('');
    setErrorPedido('');
    try {
      const items = carrito.map((p) => ({ producto_id: p.id, cantidad: 1 }));
      await api.post('/pedidos', { items });
      setExitoPedido('¡Pedido realizado con éxito!');
      setCarrito([]);
    } catch (err) {
      setErrorPedido(err.response?.data?.mensaje || 'No se pudo crear el pedido');
    }
  }

  // Estado de CARGA
  if (cargando) return <p>Cargando menú...</p>;
  // Estado de ERROR
  if (error) return <Mensaje tipo="error" texto={error} />;

  const productos = data?.productos || [];

  return (
    <div>
      <h2>Menú</h2>

      {/* Filtros que cambian el query param */}
      <div>
        <button onClick={() => cambiarCategoria('')}>Todos</button>
        <button onClick={() => cambiarCategoria('cafe')}>Café</button>
        <button onClick={() => cambiarCategoria('pan')}>Pan</button>
        <button onClick={() => cambiarCategoria('postre')}>Postres</button>
      </div>

      {/* RENDERIZADO DE LISTAS + renderizado condicional si está vacío */}
      {productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div>
          {productos.map((p) => (
            <ProductoCard
              key={p.id}
              producto={p}
              // Solo los logueados pueden agregar al pedido
              onAgregar={estaLogueado ? agregarAlCarrito : undefined}
            />
          ))}
        </div>
      )}

      {/* Detalle de cada producto vía ruta con parámetro */}
      <p>
        <small>Tip: haz clic en un producto para ver su detalle.</small>
      </p>
      <ul>
        {productos.map((p) => (
          <li key={`link-${p.id}`}>
            <Link to={`/menu/${p.id}`}>Ver detalle de {p.nombre}</Link>
          </li>
        ))}
      </ul>

      {/* Carrito - solo si hay sesión */}
      {estaLogueado && (
        <div style={{ border: '1px dashed black', padding: '8px', marginTop: '12px' }}>
          <h3>Tu pedido ({carrito.length} productos)</h3>
          {carrito.length > 0 && (
            <button onClick={confirmarPedido}>Confirmar pedido</button>
          )}
          <Mensaje tipo="exito" texto={exitoPedido} />
          <Mensaje tipo="error" texto={errorPedido} />
        </div>
      )}

      {/* Aviso para visitantes no logueados */}
      {!estaLogueado && (
        <p>
          <Link to="/login">Inicia sesión</Link> para poder ordenar.
        </p>
      )}
    </div>
  );
}

export default Menu;
