// ============================================
// COMPONENTE: RutaProtegida
// Envuelve rutas que requieren login (y opcionalmente rol admin).
// Si no cumple, redirige. Demuestra: rutas protegidas, children,
// renderizado condicional, props + PropTypes.
// ============================================
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RutaProtegida({ children, soloAdmin = false }) {
  const { estaLogueado, esAdmin, cargando } = useAuth();

  // Mientras verificamos la sesión guardada, no decidimos aún
  if (cargando) return <p>Cargando...</p>;

  // No logueado -> al login
  if (!estaLogueado) {
    return <Navigate to="/login" replace />;
  }

  // Logueado pero la ruta es solo admin y no lo es -> al inicio
  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  // Cumple -> renderiza el contenido hijo (children)
  return children;
}

RutaProtegida.propTypes = {
  children: PropTypes.node.isRequired,
  soloAdmin: PropTypes.bool,
};

export default RutaProtegida;
