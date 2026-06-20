// ============================================
// COMPONENTE: Navbar
// Barra flotante redondeada (píldora) con logo circular central que sobresale.
// Demuestra: NavLink (con clase 'activo' automática),
// renderizado condicional según rol, manejo de eventos (logout).
// ============================================
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Logo local: ajusta el nombre/extensión al archivo real en src/assets
import logo from '../assets/logo.jpg';

function Navbar() {
  const { estaLogueado, esAdmin, usuario, logout } = useAuth();
  const navigate = useNavigate();

  function manejarLogout() {
    logout();
    navigate('/');
  }

  const claseLink = ({ isActive }) => `nav__link ${isActive ? 'activo' : ''}`;

  return (
    <div
      className="nav-wrap"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Estilos />
      <nav className="nav">
        {/* Lado izquierdo */}
        <ul className="nav__links nav__links--izq">
          <li><NavLink to="/" end className={claseLink}>Inicio</NavLink></li>
          <li><NavLink to="/menu" className={claseLink}>Menú</NavLink></li>
          {estaLogueado && (
            <li><NavLink to="/mis-pedidos" className={claseLink}>Mis pedidos</NavLink></li>
          )}
        </ul>

        {/* Logo circular central que sobresale */}
        <Link to="/" className="nav__logo" aria-label="Inicio">
          <img src={logo} alt="Cafetería MOMO" className="nav__logo-img" />
        </Link>

        {/* Lado derecho */}
        <ul className="nav__links nav__links--der">
          {esAdmin && (
            <li><NavLink to="/admin" className={claseLink}>Panel Admin</NavLink></li>
          )}
          {!estaLogueado ? (
            <>
              <li><NavLink to="/login" className={claseLink}>Login</NavLink></li>
              <li><NavLink to="/registro" className={claseLink}>Registro</NavLink></li>
            </>
          ) : (
            <>
              <li className="nav__saludo">{usuario.nombre} <span className="nav__rol">({usuario.rol})</span></li>
              <li>
                <button className="nav__salir" onClick={manejarLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
                  Salir
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

// ---------- Estilos ----------
function Estilos() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&display=swap"
        rel="stylesheet"
      />
      <style>{`
      /* Contenedor que da el aire alrededor de la píldora */
      .nav-wrap {
        position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        padding: 22px 24px 10px;
        display: flex; justify-content: center;
        background: transparent;
        pointer-events: none;
      }
      .nav-wrap > .nav { pointer-events: auto; }

      /* La barra píldora */
      .nav {
        position: relative;
        display: flex; align-items: center; justify-content: space-between;
        width: min(880px, 100%);
        background: linear-gradient(180deg, #a3556a, #5e4647);
        border: 1px solid #a8827c;
        border-radius: 40px;
        padding: 12px 30px;
        box-shadow: 0 14px 30px rgba(74,39,48,.45), inset 0 1px 0 rgba(255,225,235,.18);
        font-family: Georgia, 'Times New Roman', serif;
      }

      .nav__links {
        display: flex; align-items: center; gap: 24px;
        list-style: none; margin: 0; padding: 0; flex: 1;
      }
      .nav__links--izq { justify-content: flex-start; padding-right: 40px; }
      .nav__links--der { justify-content: flex-end; padding-left: 40px; }

      .nav__link {
        color: #f2ebe2; text-decoration: none; font-size: 12px;
        letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 0;
        border-bottom: 2px solid transparent; transition: color .2s, border-color .2s;
        white-space: nowrap;
      }
      .nav__link:hover { color: #fff; }
      .nav__link.activo { color: #e6cdb0; border-bottom-color: #e6cdb0; }

      /* Logo circular central que sobresale por arriba */
      .nav__logo {
        position: absolute; left: 50%; top: 50%;
        transform: translate(-50%, -54%);
        flex: none;
      }
      .nav__logo-img {
        height: 70px; width: 70px; object-fit: contain;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 35%, #f2ebe2, #dcc8c0);
        padding: 6px;
        border: 3px solid #c98e92;
        box-shadow: 0 6px 16px rgba(74,39,48,.5);
      }

      .nav__saludo { color: #e6cdc8; font-size: 12px; font-style: italic; white-space: nowrap; }
      .nav__rol { color: #e6cdb0; text-transform: uppercase; font-size: 10px; letter-spacing: .5px; }
      .nav__salir {
        background: #c98e92; color: #fff; border: none; cursor: pointer;
        font-family: inherit; font-size: 11px; letter-spacing: 1px;
        padding: 7px 16px; border-radius: 18px;
        text-transform: uppercase; transition: background .2s; white-space: nowrap;
      }
      .nav__salir:hover { background: #a3556a; }

      @media (max-width: 760px) {
        .nav-wrap { padding: 16px 12px 8px; }
        .nav { flex-direction: column; gap: 14px; border-radius: 26px; padding: 56px 18px 16px; }
        .nav__links { gap: 14px; flex: none; justify-content: center; flex-wrap: wrap; padding: 0; }
        .nav__link { font-size: 11px; letter-spacing: 1px; }
        .nav__logo { top: 0; transform: translate(-50%, -45%); }
        .nav__logo-img { height: 58px; width: 58px; }
      }
    `}</style>
    </>
  );
}

export default Navbar;