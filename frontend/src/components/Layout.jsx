// ============================================
// COMPONENTE: Layout
// Estructura común (navbar arriba + contenido). <Outlet /> es el
// punto donde React Router inserta las RUTAS ANIDADAS.
// Demuestra: rutas anidadas + children (vía Outlet).
// ============================================
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '12px' }}>
        {/* Aquí se renderiza la ruta hija activa */}
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid black', padding: '8px' }}>
        <small>Cafetería MOMO · Aguascalientes</small>
      </footer>
    </div>
  );
}

export default Layout;
