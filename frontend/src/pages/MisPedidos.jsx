// ============================================
// PÁGINA: MisPedidos (usuario logueado)
// Muestra los pedidos YA CONFIRMADOS como TICKETS de impresora térmica.
// (El carrito para armar pedidos nuevos vive en la página de Menú.)
//
// Demuestra: ruta protegida (se monta dentro de RutaProtegida),
// renderizado de listas, renderizado condicional, estados carga/éxito/error,
// hook useFetch, componentes funcionales + props + PropTypes.
// ============================================
import PropTypes from 'prop-types';
import { useFetch } from '../hooks/useFetch';
import Mensaje from '../components/Mensaje';

// Etiqueta legible por estado del pedido
const ESTADO_TEXTO = {
  pendiente: 'PENDIENTE',
  preparando: 'EN PREPARACION',
  listo: 'LISTO',
  entregado: 'ENTREGADO',
  cancelado: 'CANCELADO',
};

// ---------- Subcomponente: un ticket ----------
function Ticket({ pedido }) {
  const { id, total, estado, creado_en } = pedido;
  const fecha = new Date(creado_en);
  const totalNum = Number(total);
  // Desglose simple a partir del total (no hay items en la API).
  // Asumimos IVA 16% incluido para mostrar subtotal + impuesto, como un recibo real.
  const subtotal = totalNum / 1.16;
  const impuesto = totalNum - subtotal;

  // Código de barras "falso": barras de ancho variable según el id (decorativo)
  const barras = generarBarras(id);

  return (
    <div className="mp-ticket">
      <div className="mp-ticket__top" aria-hidden />
      <div className="mp-ticket__cuerpo">
        <h3 className="mp-ticket__marca">COFFEE SHOP</h3>
        <p className="mp-ticket__sub">Hecho con amor desde 2024</p>
        <p className="mp-ticket__sub">Sunset Str, 5</p>

        <div className="mp-sep" />

        <Linea etiqueta={`Pedido #${id}`} />
        <Linea etiqueta="Fecha" valor={fecha.toLocaleDateString()} />
        <Linea etiqueta="Hora" valor={fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
        <Linea etiqueta="Estado" valor={ESTADO_TEXTO[estado] || String(estado).toUpperCase()} />

        <div className="mp-sep" />

        <Linea etiqueta="Subtotal" valor={`$${subtotal.toFixed(2)}`} />
        <Linea etiqueta="IVA (16%)" valor={`$${impuesto.toFixed(2)}`} />
        <Linea etiqueta="TOTAL" valor={`$${totalNum.toFixed(2)}`} fuerte />

        <div className="mp-sep" />

        <p className="mp-ticket__pago">xxxx xxxx xxxx 1234</p>

        {/* Código de barras decorativo */}
        <div className="mp-barras">
          {barras.map((ancho, i) => (
            <span key={i} className="mp-barra" style={{ width: `${ancho}px` }} />
          ))}
        </div>
        <p className="mp-ticket__codigo">{String(id).padStart(6, '0')} {fecha.getFullYear()}</p>

        <p className="mp-ticket__gracias">¡GRACIAS POR TU COMPRA!</p>
      </div>
      <div className="mp-ticket__rasgado" aria-hidden />
    </div>
  );
}
Ticket.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    estado: PropTypes.string.isRequired,
    creado_en: PropTypes.string.isRequired,
  }).isRequired,
};

// ---------- Subcomponente: una línea etiqueta–valor ----------
function Linea({ etiqueta, valor, fuerte }) {
  return (
    <div className={`mp-linea ${fuerte ? 'mp-linea--fuerte' : ''}`}>
      <span className="mp-linea__etq">{etiqueta}</span>
      {/* Renderizado condicional: solo muestra valor si existe */}
      {valor !== undefined && <span className="mp-linea__val">{valor}</span>}
    </div>
  );
}
Linea.propTypes = {
  etiqueta: PropTypes.string.isRequired,
  valor: PropTypes.string,
  fuerte: PropTypes.bool,
};
Linea.defaultProps = { valor: undefined, fuerte: false };

// Genera anchos de barra pseudo-aleatorios pero estables por id
function generarBarras(id) {
  const semilla = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const barras = [];
  for (let i = 0; i < 40; i++) {
    // patrón determinista: ancho entre 1 y 4 px
    const v = (semilla * (i + 3) * 7) % 4;
    barras.push(v + 1);
  }
  return barras;
}

// ---------- Componente principal ----------
function MisPedidos() {
  const { data, cargando, error } = useFetch('/pedidos/mios');

  if (cargando) return <p style={{ padding: 24, color: '#e9dcc8' }}>Cargando tus pedidos...</p>;
  if (error) return <div style={{ padding: 24 }}><Mensaje tipo="error" texto={error} /></div>;

  const pedidos = data?.pedidos || [];

  return (
    <div className="mp-root">
      <Estilos />
      <h2 className="mp-titulo">Mis Pedidos</h2>

      {/* Renderizado condicional: vacío vs lista de tickets */}
      {pedidos.length === 0 ? (
        <p className="mp-vacio">Aún no tienes pedidos. ¡Visita el menú para hacer el primero! ✦</p>
      ) : (
        <div className="mp-grid">
          {/* Renderizado de listas */}
          {pedidos.map((p) => (
            <Ticket key={p.id} pedido={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Estilos ----------
function Estilos() {
  return (
    <>
      {/* Carga de tipografías desde Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .mp-root {
        --cafe: #6e5556; --cafe2: #a3556a; --crema: #f2ebe2;
        --display: 'Playfair Display', Georgia, serif;
        min-height: 100%;
        background: radial-gradient(circle at 50% 0%, #7a5d5e, #5e4647);
        font-family: 'Cormorant Garamond', Georgia, serif;
        padding: 130px 16px 48px; text-align: center;
      }
      .mp-titulo {
        font-family: var(--display); font-style: italic; font-weight: 600;
        font-size: 46px; color: #f2ebe2; margin: 0 0 28px;
        text-align: center; text-shadow: 0 2px 12px rgba(0,0,0,.4);
      }
      .mp-vacio { color: #d9aeac; font-style: italic; }

      .mp-grid {
        display: flex; flex-wrap: wrap; gap: 28px;
        justify-content: center; align-items: flex-start;
      }

      /* ---- Ticket de impresora térmica ---- */
      .mp-ticket {
        width: 280px; position: relative;
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.45));
      }
      /* Borde superior recto (como saliendo de la impresora) */
      .mp-ticket__top {
        height: 10px; background: #f7f5f0;
        border-radius: 3px 3px 0 0;
        box-shadow: inset 0 4px 6px -4px rgba(0,0,0,.25);
      }
      .mp-ticket__cuerpo {
        background: #f7f5f0; color: #2b2b2b;
        padding: 18px 22px 22px;
        font-family: 'Courier New', Courier, monospace;
        text-align: center;
      }
      /* Borde inferior dentado (papel rasgado) */
      .mp-ticket__rasgado {
        height: 12px;
        background:
          linear-gradient(135deg, transparent 50%, #f7f5f0 50%) repeat-x,
          linear-gradient(-135deg, transparent 50%, #f7f5f0 50%) repeat-x;
        background-size: 12px 12px;
        background-position: 0 0;
      }

      .mp-ticket__marca {
        margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px;
        letter-spacing: 2px; color: #a3556a;
      }
      .mp-ticket__sub { margin: 2px 0 0; font-size: 10px; color: #555; }

      .mp-sep { border-top: 1px dashed #999; margin: 12px 0; }

      .mp-linea {
        display: flex; justify-content: space-between;
        font-size: 12px; color: #333; margin: 3px 0; gap: 8px;
      }
      .mp-linea__etq { text-align: left; }
      .mp-linea__val { text-align: right; white-space: nowrap; }
      .mp-linea--fuerte { font-weight: bold; font-size: 14px; color: #111; }

      .mp-ticket__pago { font-size: 11px; color: #555; letter-spacing: 1px; margin: 4px 0; }

      .mp-barras {
        display: flex; justify-content: center; align-items: flex-end;
        gap: 1px; height: 46px; margin: 14px 0 6px;
      }
      .mp-barra { display: block; height: 100%; background: #1c1c1c; }
      .mp-ticket__codigo { font-size: 11px; letter-spacing: 3px; color: #333; margin: 0 0 12px; }

      .mp-ticket__gracias {
        font-family: 'Playfair Display', Georgia, serif; font-style: italic;
        font-size: 16px; letter-spacing: 1px; color: #a3556a; margin: 6px 0 0;
      }
    `}</style>
    </>
  );
}

export default MisPedidos;