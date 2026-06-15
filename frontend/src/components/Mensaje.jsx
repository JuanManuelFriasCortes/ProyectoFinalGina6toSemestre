// ============================================
// COMPONENTE: Mensaje
// Muestra mensajes de ÉXITO o ERROR en la interfaz
// (NO usa alert() del navegador, como exige la rúbrica).
// Demuestra: props, PropTypes, renderizado condicional.
// ============================================
import PropTypes from 'prop-types';

function Mensaje({ tipo, texto }) {
  // Renderizado condicional: si no hay texto, no renderiza nada
  if (!texto) return null;

  // HTML pelón: solo un borde para distinguir éxito/error.
  // El compañero de diseño le pondrá estilo después.
  const borde = tipo === 'error' ? '2px solid red' : '2px solid green';

  return (
    <p
      role="alert"
      data-tipo={tipo}
      style={{ border: borde, padding: '8px', display: 'inline-block' }}
    >
      {texto}
    </p>
  );
}

Mensaje.propTypes = {
  tipo: PropTypes.oneOf(['exito', 'error']).isRequired,
  texto: PropTypes.string,
};

Mensaje.defaultProps = {
  texto: '',
};

export default Mensaje;
