// ============================================
// PÁGINA: Inicio (pública) — estilo "International Coffee Day"
// Layout de 3 zonas: título centrado arriba, café al centro, info a los lados.
// Demuestra: renderizado condicional según sesión, estado global (useAuth),
// componentes funcionales + props, manejo de eventos.
// ============================================
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Imagen local del café: ajusta el nombre/extensión a tu archivo en src/assets
import heroCafe from '../assets/bebida.png';

function Inicio() {
  const { estaLogueado, usuario } = useAuth();

  return (
    <div className="ci-root">
      <Estilos />

      <div className="ci-banner">
        {/* Flores decorativas en las esquinas */}
        <span className="ci-flor ci-flor--tl" aria-hidden>❀</span>
        <span className="ci-flor ci-flor--bl" aria-hidden>❀</span>
        <span className="ci-flor ci-flor--tr" aria-hidden>❀</span>
        <span className="ci-flor ci-flor--br" aria-hidden>❀</span>

        {/* ---- Título centrado arriba ---- */}
        <h1 className="ci-titulo">Cafetería MOMO</h1>

        {/* ---- Cuerpo de 3 columnas ---- */}
        <div className="ci-cuerpo">
          {/* Columna izquierda */}
          <div className="ci-col ci-col--izq">
            {/* Renderizado condicional según sesión */}
            {estaLogueado ? (
              <>
                <p className="ci-saludo">Hola de nuevo,<br /><b>{usuario?.nombre}</b></p>
                <Link to="/menu" className="ci-btn ci-btn--lleno">Ver el menú</Link>
                <Link to="/mis-pedidos" className="ci-btn">Mis pedidos</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="ci-btn">Login</Link>
                <Link to="/registro" className="ci-btn">Registrarse</Link>
              </>
            )}

            <p className="ci-texto-min">
              Café recién hecho, pan artesanal y postres que enamoran a primer
              sorbo. Hecho con amor desde 2024.
            </p>

            <div className="ci-social">
              <span className="ci-social__ico" aria-hidden>✕</span>
              <span className="ci-social__ico" aria-hidden>f</span>
              <span className="ci-social__ico" aria-hidden>📷</span>
            </div>
          </div>

          {/* Columna central: imagen del café */}
          <div className="ci-centro">
            <div className="ci-blob">
              <img src={heroCafe} alt="Café recién servido" className="ci-blob__img" />
            </div>
            <span className="ci-oferta">Recién<br />hecho</span>
          </div>

          {/* Columna derecha */}
          <div className="ci-col ci-col--der">
            <span className="ci-fecha">Abierto hoy</span>
            <h3 className="ci-direccion">3452 Av.<br />Aguascalientes</h3>
            <p className="ci-texto-min">
              Visítanos cualquier día de la semana y disfruta el mejor café
              de la ciudad en un ambiente acogedor.
            </p>
          </div>
        </div>
      </div>
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .ci-root {
        --crema1: #f2ebe2;
        --crema2: #e8e0d6;
        --sepia: #c98e92;
        --cafe: #a3556a;
        --texto: #a8827c;
        --display: 'Playfair Display', Georgia, serif;
        --serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
        min-height: 100vh;
        background: linear-gradient(135deg, #f2ebe2 0%, #e8e0d6 60%, #dcc8c0 100%);
        font-family: var(--serif);
      }

      /* Banner con degradado crema */
      .ci-banner {
        position: relative; overflow: hidden;
        max-width: 1280px; margin: 0 auto; min-height: 620px;
        background: linear-gradient(135deg, #f2ebe2 0%, #e8e0d6 60%, #dcc8c0 100%);
        padding: 130px 64px 64px;
        display: flex; flex-direction: column; justify-content: center;
      }

      /* Flores decorativas */
      .ci-flor { position: absolute; color: var(--sepia); opacity: .4; font-size: 40px; pointer-events: none; }
      .ci-flor--tl { top: 16px; left: 18px; }
      .ci-flor--bl { bottom: 16px; left: 22px; font-size: 34px; }
      .ci-flor--tr { top: 18px; right: 20px; font-size: 36px; }
      .ci-flor--br { bottom: 18px; right: 18px; font-size: 42px; }

      /* ---- Título centrado ---- */
      .ci-titulo {
        font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 700;
        font-size: 68px; color: var(--cafe); text-align: center; margin: 0 0 36px;
        position: relative; z-index: 2;
      }

      /* ---- Cuerpo 3 columnas ---- */
      .ci-cuerpo {
        display: grid; grid-template-columns: 1fr 1.2fr 1fr;
        align-items: center; gap: 24px;
      }
      .ci-col { display: flex; flex-direction: column; gap: 12px; }
      .ci-col--izq { align-items: flex-start; }
      .ci-col--der { align-items: flex-end; text-align: right; }

      .ci-saludo { margin: 0 0 4px; font-size: 16px; color: var(--texto); }
      .ci-saludo b { font-size: 19px; color: var(--cafe); }

      .ci-btn {
        display: inline-block; text-decoration: none; font-family: inherit;
        font-size: 14px; font-weight: 500; color: var(--cafe);
        border: 1.5px solid var(--sepia); border-radius: 24px;
        padding: 9px 30px; transition: background .2s, color .2s, transform .15s;
        text-align: center; min-width: 130px;
      }
      .ci-btn:hover { background: var(--cafe); color: #f2ebe2; transform: translateY(-2px); }
      .ci-btn--lleno { background: var(--cafe); color: #f2ebe2; border-color: var(--cafe); }
      .ci-btn--lleno:hover { background: #7a4453; }

      .ci-texto-min { font-size: 13px; line-height: 1.6; color: #9c7d76; max-width: 200px; margin: 8px 0 0; }
      .ci-col--der .ci-texto-min { max-width: 200px; }

      .ci-social { display: flex; gap: 10px; margin-top: 8px; }
      .ci-social__ico {
        width: 28px; height: 28px; display: grid; place-items: center;
        background: var(--cafe); color: #f2ebe2; border-radius: 50%; font-size: 12px;
      }

      .ci-fecha {
        display: inline-block; border: 1px solid var(--sepia); color: var(--cafe);
        border-radius: 20px; padding: 6px 18px; font-size: 13px; margin-bottom: 4px;
      }
      .ci-direccion {
        font-family: 'Playfair Display', serif; font-weight: 600; font-size: 22px;
        color: var(--cafe); margin: 4px 0; line-height: 1.2;
      }

      /* ---- Centro: imagen del café ---- */
      .ci-centro { position: relative; display: grid; place-items: center; }
      .ci-blob {
        width: 360px; height: 360px; overflow: hidden;
        background: radial-gradient(circle at 50% 40%, #f2ebe2, #dcc8c0);
        border-radius: 52% 48% 46% 54% / 56% 52% 48% 44%;
        box-shadow: 0 16px 36px rgba(107,74,47,.35);
      }
      .ci-blob__img { width: 100%; height: 100%; object-fit: contain; padding: 26px; box-sizing: border-box; }
      .ci-oferta {
        position: absolute; top: 36px; right: 6px;
        background: var(--cafe); color: #f2ebe2; text-align: center;
        font-family: 'Playfair Display', serif; font-size: 15px; line-height: 1.1;
        padding: 10px 18px; border-radius: 10px 10px 0 10px;
        box-shadow: 0 8px 18px rgba(107,74,47,.4);
      }

      @media (max-width: 820px) {
        .ci-titulo { font-size: 36px; }
        .ci-cuerpo { grid-template-columns: 1fr; justify-items: center; gap: 28px; }
        .ci-col--izq, .ci-col--der { align-items: center; text-align: center; }
        .ci-col--der { order: 3; }
        .ci-centro { order: 1; }
        .ci-texto-min { max-width: 280px; }
        .ci-flor { display: none; }
      }
    `}</style>
    </>
  );
}

export default Inicio;