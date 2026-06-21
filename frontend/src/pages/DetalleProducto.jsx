// ============================================
// PÁGINA: DetalleProducto
// Se accede con una RUTA CON PARÁMETRO: /menu/:id
// Demuestra: useParams, consumo de API por id, estados, async/await (useFetch),
// componentes funcionales, renderizado condicional.
//
// Diseño: el detalle va dentro de un "plato" circular (como un plato real,
// con borde y brillo) sobre el fondo de la página de Inicio.
// ============================================
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Mensaje from '../components/Mensaje';

const ICONO_POR_CATEGORIA = { cafe: '☕', pan: '🥐', postre: '🍰' };

function DetalleProducto() {
  // useParams lee el :id de la URL
  const { id } = useParams();
  const { data, cargando, error } = useFetch(`/productos/${id}`);

  if (cargando) return <div className="dp-root"><Estilos /><p className="dp-cargando">Cargando producto...</p></div>;
  if (error) return <div className="dp-root"><Estilos /><div style={{ marginTop: 40 }}><Mensaje tipo="error" texto={error} /></div></div>;

  const producto = data?.producto;
  if (!producto) {
    return (
      <div className="dp-root">
        <Estilos />
        <div className="dp-plato">
          <div className="dp-plato__centro">
            <p className="dp-vacio">Producto no encontrado.</p>
            <Link to="/menu" className="dp-volver">← Volver al menú</Link>
          </div>
        </div>
      </div>
    );
  }

  const icono = ICONO_POR_CATEGORIA[producto.categoria] || '✦';

  return (
    <div className="dp-root">
      <Estilos />

      {/* Plato */}
      <div className="dp-plato">
        <div className="dp-plato__centro">
          <span className="dp-icono" aria-hidden>{icono}</span>
          <h2 className="dp-nombre">{producto.nombre}</h2>

          {/* Renderizado condicional: etiqueta de disponibilidad */}
          <span className={`dp-estado ${producto.disponible ? 'dp-estado--ok' : 'dp-estado--no'}`}>
            {producto.disponible ? 'Disponible' : 'Agotado'}
          </span>

          {producto.descripcion ? <p className="dp-desc">{producto.descripcion}</p> : null}

          <div className="dp-datos">
            <div className="dp-dato">
              <span className="dp-dato__etq">Categoría</span>
              <span className="dp-dato__val">{producto.categoria}</span>
            </div>
            <div className="dp-dato">
              <span className="dp-dato__etq">Precio</span>
              <span className="dp-dato__val dp-precio">${Number(producto.precio).toFixed(2)}</span>
            </div>
          </div>

          <Link to="/menu" className="dp-volver">← Volver al menú</Link>
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .dp-root {
        min-height: 100vh;
        /* Mismo fondo que la página de Inicio (Rosegold Aura) */
        background: linear-gradient(135deg, #f2ebe2 0%, #e8e0d6 60%, #dcc8c0 100%);
        font-family: 'Cormorant Garamond', Georgia, serif;
        padding: 130px 16px 50px;
        display: flex; justify-content: center; align-items: flex-start;
      }
      .dp-cargando { color: #5e4647; margin-top: 40px; }

      /* ---- Plato ---- */
      .dp-plato {
        position: relative;
        width: min(480px, 92vw);
        aspect-ratio: 1 / 1;          /* círculo perfecto */
        border-radius: 50%;
        /* degradado para dar volumen, sin halo claro en el borde */
        background:
          radial-gradient(circle at 50% 42%, #ffffff 0%, #f4f1ec 60%, #e8e1d5 82%, #d8cfc0 100%);
        box-shadow:
          0 26px 50px rgba(94,70,71,.35),
          inset 0 0 30px rgba(0,0,0,.07);
        display: grid; place-items: center;
      }
      /* anillo interior del plato */
      .dp-plato::before {
        content: ''; position: absolute; inset: 12%;
        border-radius: 50%;
        box-shadow: inset 0 0 0 2px rgba(0,0,0,.05), 0 2px 6px rgba(0,0,0,.04);
      }
      /* brillo sutil */
      .dp-plato::after {
        content: ''; position: absolute; top: 12%; left: 20%;
        width: 40%; height: 24%; border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,.7), transparent 70%);
        pointer-events: none;
      }

      /* Contenido centrado dentro del plato (zona segura circular) */
      .dp-plato__centro {
        position: relative; z-index: 2;
        width: 66%; text-align: center;
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        color: #5e4647;
      }

      .dp-icono {
        font-size: 34px; width: 64px; height: 64px; display: grid; place-items: center;
        background: #e6cdb0; border-radius: 50%; margin-bottom: 2px;
      }
      .dp-nombre {
        font-family: 'Playfair Display', Georgia, serif; font-style: italic;
        font-size: 28px; margin: 0; color: #a3556a; line-height: 1.1;
      }
      .dp-estado {
        display: inline-block; font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
        padding: 3px 12px; border-radius: 12px; color: #fff;
      }
      .dp-estado--ok { background: #6e9a78; }
      .dp-estado--no { background: #b5566a; }
      .dp-desc { font-style: italic; color: #9c7d76; font-size: 14px; margin: 4px 0; line-height: 1.4; }

      .dp-datos {
        display: flex; justify-content: center; gap: 28px;
        border-top: 1px dashed #d8cabf; border-bottom: 1px dashed #d8cabf;
        padding: 12px 0; margin: 4px 0;
      }
      .dp-dato { display: flex; flex-direction: column; gap: 2px; }
      .dp-dato__etq { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #a8827c; }
      .dp-dato__val { font-size: 15px; color: #5e4647; text-transform: capitalize; }
      .dp-precio { font-weight: bold; color: #a3556a; }

      .dp-volver {
        display: inline-block; text-decoration: none; margin-top: 4px;
        background: #a3556a; color: #fff; padding: 9px 20px; border-radius: 8px;
        font-size: 13px; letter-spacing: .5px; transition: background .2s;
      }
      .dp-volver:hover { background: #8a4459; }
      .dp-vacio { color: #9c7d76; font-style: italic; margin: 0 0 14px; }

      @media (max-width: 520px) {
        .dp-nombre { font-size: 23px; }
        .dp-plato__centro { width: 72%; }
        .dp-datos { gap: 18px; }
      }
      `}</style>
    </>
  );
}

export default DetalleProducto;