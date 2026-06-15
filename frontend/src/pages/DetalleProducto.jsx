// ============================================
// PÁGINA: DetalleProducto
// Se accede con una RUTA CON PARÁMETRO: /menu/:id
// Demuestra: useParams, consumo de API por id, estados, async/await.
// ============================================
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Mensaje from '../components/Mensaje';

function DetalleProducto() {
  // useParams lee el :id de la URL
  const { id } = useParams();
  const { data, cargando, error } = useFetch(`/productos/${id}`);

  if (cargando) return <p>Cargando producto...</p>;
  if (error) return <Mensaje tipo="error" texto={error} />;

  const producto = data?.producto;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>Precio: ${Number(producto.precio).toFixed(2)} MXN</p>
      <p>{producto.disponible ? 'Disponible' : 'Agotado'}</p>
      <Link to="/menu">← Volver al menú</Link>
    </div>
  );
}

export default DetalleProducto;
