// ============================================
// COMPONENTE: ProductoCard
// Recibe un producto por PROPS y lo muestra. Si le pasan la prop
// onAgregar, muestra un botón para agregarlo al pedido.
// Demuestra: props entre componentes, PropTypes, manejo de eventos,
// funciones anidadas y renderizado condicional.
// ============================================
import PropTypes from 'prop-types';

function ProductoCard({ producto, onAgregar, onEditar, onEliminar }) {
  // FUNCIÓN ANIDADA: definida dentro del componente, usa datos del scope.
  // Da formato al precio en pesos mexicanos.
  function formatearPrecio(valor) {
    // función anidada dentro de la función anidada
    const aNumero = () => Number(valor).toFixed(2);
    return `$${aNumero()} MXN`;
  }

  return (
    <div style={{ border: '1px solid gray', padding: '8px', margin: '4px' }}>
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>{formatearPrecio(producto.precio)}</p>

      {/* Renderizado condicional según las props que llegan */}
      {producto.disponible ? <span>Disponible</span> : <span>Agotado</span>}

      <div>
        {/* Manejo de eventos: onClick. Solo se muestra si la prop existe */}
        {onAgregar && (
          <button onClick={() => onAgregar(producto)}>Agregar al pedido</button>
        )}
        {onEditar && <button onClick={() => onEditar(producto)}>Editar</button>}
        {onEliminar && (
          <button onClick={() => onEliminar(producto.id)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}

// Validación de propiedades con PropTypes
ProductoCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    categoria: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    disponible: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  }).isRequired,
  onAgregar: PropTypes.func,
  onEditar: PropTypes.func,
  onEliminar: PropTypes.func,
};

export default ProductoCard;
