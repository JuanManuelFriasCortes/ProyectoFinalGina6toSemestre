// ============================================
// PÁGINA: NoEncontrado (Error 404)
// Se muestra para cualquier ruta que no exista (ruta comodín *).
// Demuestra: manejo de error 404.
// ============================================
import { Link } from 'react-router-dom';

function NoEncontrado() {
  return (
    <div>
      <h2>404 - Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default NoEncontrado;
