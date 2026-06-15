// ============================================
// COMPONENTE: Navbar
// Menú de navegación. Cambia según quién esté logueado.
// Demuestra: NavLink (con clase 'active' automática),
// renderizado condicional según rol, manejo de eventos (logout).
// ============================================
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { estaLogueado, esAdmin, usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Manejo de evento: cerrar sesión y redirigir
  function manejarLogout() {
    logout();
    navigate('/'); // vuelve al inicio
  }

  // NavLink marca como activo el enlace actual automáticamente
  const estilo = ({ isActive }) => ({
    marginRight: '10px',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <nav style={{ borderBottom: '1px solid black', padding: '8px' }}>
      <NavLink to="/" style={estilo}>Inicio</NavLink>
      <NavLink to="/menu" style={estilo}>Menú</NavLink>

      {/* Visible solo si NO está logueado */}
      {!estaLogueado && (
        <>
          <NavLink to="/login" style={estilo}>Login</NavLink>
          <NavLink to="/registro" style={estilo}>Registro</NavLink>
        </>
      )}

      {/* Visible para usuario logueado (cliente o admin) */}
      {estaLogueado && (
        <NavLink to="/mis-pedidos" style={estilo}>Mis pedidos</NavLink>
      )}

      {/* Visible SOLO para admin */}
      {esAdmin && (
        <NavLink to="/admin" style={estilo}>Panel Admin</NavLink>
      )}

      {/* Saludo + logout si está logueado */}
      {estaLogueado && (
        <span>
          | Hola, {usuario.nombre} ({usuario.rol}){' '}
          <button onClick={manejarLogout}>Cerrar sesión</button>
        </span>
      )}
    </nav>
  );
}

export default Navbar;
