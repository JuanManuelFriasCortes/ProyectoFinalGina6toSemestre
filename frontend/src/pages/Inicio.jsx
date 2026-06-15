// ============================================
// PÁGINA: Inicio (pública - acceso para NADIE logueado también)
// Demuestra: renderizado condicional según sesión, estado global.
// ============================================
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Inicio() {
  const { estaLogueado, usuario } = useAuth();

  return (
    <div>
      <h1>Bienvenido a Cafetería MOMO ☕</h1>
      <p>La mejor cafetería de Aguascalientes.</p>

      {/* Renderizado condicional según si hay sesión */}
      {estaLogueado ? (
        <p>Hola de nuevo, {usuario.nombre}. ¿Listo para tu café?</p>
      ) : (
        <p>
          <Link to="/registro">Regístrate</Link> o{' '}
          <Link to="/login">inicia sesión</Link> para hacer tu pedido.
        </p>
      )}

      <p>
        Cualquier visitante puede ver nuestro <Link to="/menu">menú</Link>.
      </p>
    </div>
  );
}

export default Inicio;
