// ============================================
// APP - Configuración de rutas (React Router)
// Demuestra de un solo golpe varios puntos de la rúbrica:
//   - Routing con React Router
//   - Rutas anidadas (dentro de <Layout>)
//   - Rutas con parámetros (/menu/:id)
//   - Rutas protegidas (RutaProtegida)
//   - Error 404 (ruta comodín *)
//   - LAZY LOADING (React.lazy + Suspense) en el Panel Admin
// ============================================
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import RutaProtegida from './components/RutaProtegida';

// Páginas normales (carga directa)
import Inicio from './pages/Inicio';
import Menu from './pages/Menu';
import DetalleProducto from './pages/DetalleProducto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MisPedidos from './pages/MisPedidos';
import NoEncontrado from './pages/NoEncontrado';

// LAZY LOADING: el Panel Admin se carga solo cuando se necesita.
// Esto reduce el tamaño del bundle inicial.
const PanelAdmin = lazy(() => import('./pages/PanelAdmin'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Cargando módulo...</p>}>
        <Routes>
          {/* Rutas ANIDADAS dentro del Layout (navbar + outlet) */}
          <Route path="/" element={<Layout />}>
            {/* Públicas (acceso sin login) */}
            <Route index element={<Inicio />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<DetalleProducto />} /> {/* parámetro */}
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            {/* Protegida: requiere login */}
            <Route
              path="mis-pedidos"
              element={
                <RutaProtegida>
                  <MisPedidos />
                </RutaProtegida>
              }
            />

            {/* Protegida + solo admin (con lazy loading) */}
            <Route
              path="admin"
              element={
                <RutaProtegida soloAdmin>
                  <PanelAdmin />
                </RutaProtegida>
              }
            />

            {/* 404 - cualquier otra ruta */}
            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
