// ============================================
// COMPONENTE: Layout
// Estructura común (navbar fijo transparente + contenido). <Outlet /> es
// el punto donde React Router inserta las RUTAS ANIDADAS.
// Demuestra: rutas anidadas + children (vía Outlet).
// ============================================
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      {/* El navbar es fijo y transparente. NO ponemos padding-top aquí:
          cada página deja su propio espacio superior (con padding-top en su
          contenedor raíz) y sube su fondo detrás de la píldora. Así el fondo
          del navbar coincide con el color de CADA página. */}
      <main>
        <Outlet />
      </main>

      <footer style={{
        borderTop: '1px solid #8a6d6a',
        padding: '14px',
        textAlign: 'center',
        color: '#d9aeac',
        background: '#5e4647',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '14px',
      }}>
        <small>Cafetería MOMO · Aguascalientes</small>
      </footer>
    </div>
  );
}

export default Layout;