// ============================================
// PÁGINA: Menú (libro animado) — CONECTADA A LA API
// Modelo tipo CAPÍTULOS: los productos fluyen página tras página.
// Cuando una categoría termina, la siguiente empieza en la página que sigue.
//
// Categorías reales de la BD: cafe, pan, postres. Más vista "Todos".
// Cada producto: nombre, descripcion, categoria, precio, disponible.
//
// Demuestra de la rúbrica:
//   - Hook personalizado (useFetch) + consumo de API con axios
//   - Estados de carga / éxito / error
//   - useState, useEffect (montaje: teclado / limpieza: removerlo)
//   - QUERY PARAMS: ?categoria=... salta al capítulo en la URL
//   - Componentes funcionales + props + PropTypes
//   - Renderizado condicional (disponible/agotado) y de listas
//
// EFECTO LIBRO (sin duplicación, sin delay):
//   El contenido de cada hoja física se calcula con paginarContenido().
//   Cada hoja tiene cara frontal (página impar) y trasera (par) DISTINTAS.
//   El título de la categoría sale solo en la primera página del capítulo.
//   Animación 100% CSS transition.
// ============================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Mensaje from '../components/Mensaje';

// Cuántos productos caben por página antes de saltar a la siguiente.
const ITEMS_POR_PAGINA = 4;

const CATEGORIAS = [
  { id: 'todos', nombre: 'Todos', color: '#8a4459', eyebrow: '✦ Todo el menú ✦' },
  { id: 'cafe', nombre: 'Café', color: '#a8827c', eyebrow: '✦ Recién hecho ✦' },
  { id: 'pan', nombre: 'Pan', color: '#c98e92', eyebrow: '✦ De la panadería ✦' },
  { id: 'postre', nombre: 'Postres', color: '#a3556a', eyebrow: '✦ Algo dulce ✦' },
];

const ICONO_POR_CATEGORIA = { todos: '✦', cafe: '☕', pan: '🥐', postre: '🍰' };

// ---------- Subcomponente: ítem del menú ----------
function ItemMenu({ producto, icono, onAgregar }) {
  const { nombre, descripcion, precio, disponible } = producto;
  return (
    <div className={`ml-item ${disponible ? '' : 'ml-item--agotado'}`}>
      <span className="ml-item__icono" aria-hidden>{icono}</span>
      <div className="ml-item__texto">
        <h4 className="ml-item__nombre">
          {/* Ruta con parámetro: /menu/:id -> abre el detalle del producto */}
          <Link to={`/menu/${producto.id}`} className="ml-item__link">{nombre}</Link>
          {!disponible && <span className="ml-item__tag">Agotado</span>}
        </h4>
        {descripcion ? <p className="ml-item__desc">{descripcion}</p> : null}
      </div>
      <div className="ml-item__derecha">
        <span className="ml-item__precio">${Number(precio).toFixed(0)}</span>
        {/* Botón solo si hay sesión (onAgregar definido). Renderizado condicional. */}
        {onAgregar && (
          <button
            className="ml-item__agregar"
            onClick={() => onAgregar(producto)}
            disabled={!disponible}
            title={disponible ? 'Agregar al pedido' : 'No disponible'}
          >
            {disponible ? '+ Agregar' : 'Agotado'}
          </button>
        )}
      </div>
    </div>
  );
}
ItemMenu.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    disponible: PropTypes.bool,
  }).isRequired,
  icono: PropTypes.string,
  onAgregar: PropTypes.func,
};
ItemMenu.defaultProps = { icono: '✦', onAgregar: undefined };

// ---------- Subcomponente: una página física ----------
// Recibe un objeto 'pagina' ya calculado por paginarContenido().
function Pagina({ pagina, onAgregar }) {
  if (!pagina || pagina.tipo === 'vacia') {
    return <div className="ml-pagina ml-pagina--vacia" />;
  }

  if (pagina.tipo === 'portada') {
    return (
      <div className="ml-pagina ml-pagina--portada">
        <div>
          <h1 className="ml-portada__titulo">Bienvenido a<br />nuestra cafetería</h1>
          <p className="ml-portada__sub">Hecho con amor desde 2024</p>
        </div>
        <span className="ml-folio">{pagina.numero}</span>
      </div>
    );
  }

  if (pagina.tipo === 'fin') {
    return (
      <div className="ml-pagina ml-pagina--vacia">
        <p className="ml-fin">Gracias por tu visita ✦</p>
        <span className="ml-folio">{pagina.numero}</span>
      </div>
    );
  }

  return (
    <div className="ml-pagina">
      {/* El título solo aparece en la primera página de cada capítulo */}
      {pagina.mostrarTitulo && (
        <>
          <p className="ml-eyebrow">{pagina.eyebrow}</p>
          <h2 className="ml-titulo">{pagina.titulo}</h2>
        </>
      )}
      <div className="ml-items">
        {pagina.items.map((p) => (
          <ItemMenu
            key={p.id}
            producto={p}
            icono={ICONO_POR_CATEGORIA[p.categoria] || '✦'}
            onAgregar={onAgregar}
          />
        ))}
      </div>
      <span className="ml-folio">{pagina.numero}</span>
    </div>
  );
}
Pagina.propTypes = { pagina: PropTypes.object, onAgregar: PropTypes.func };

// ---------- Lógica: convertir productos en páginas tipo capítulo ----------
// Recorre cada categoría con productos y va cortando en páginas de
// ITEMS_POR_PAGINA. El título se marca solo en la primera página del capítulo.
function paginarContenido(grupos) {
  const paginas = []; // sin portada: arranca directo en el contenido

  grupos.forEach(({ id, nombre, eyebrow, items }) => {
    if (items.length === 0) return;
    for (let i = 0; i < items.length; i += ITEMS_POR_PAGINA) {
      paginas.push({
        tipo: 'contenido',
        categoria: id,
        titulo: nombre,
        eyebrow,
        mostrarTitulo: i === 0, // solo el primer corte lleva título
        items: items.slice(i, i + ITEMS_POR_PAGINA),
      });
    }
  });

  // Asegura número par de páginas para que el libro cierre bien
  if (paginas.length % 2 !== 0) paginas.push({ tipo: 'fin' });

  // Asigna folio (número de página) a cada una
  paginas.forEach((p, idx) => { p.numero = idx + 1; });
  return paginas;
}

// ---------- Componente principal ----------
function MenuLibro() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaUrl = searchParams.get('categoria') || '';

  const { estaLogueado } = useAuth();

  const { data, cargando, error } = useFetch('/productos');

  // ----- Carrito (estado local) -----
  const [carrito, setCarrito] = useState([]);
  const [exitoPedido, setExitoPedido] = useState('');
  const [errorPedido, setErrorPedido] = useState('');
  const [enviando, setEnviando] = useState(false);

  function agregarAlCarrito(producto) {
    setCarrito((prev) => [...prev, producto]);
    setExitoPedido('');
    setErrorPedido('');
  }

  function quitarDelCarrito(indice) {
    setCarrito((prev) => prev.filter((_, i) => i !== indice));
  }

  async function confirmarPedido() {
    setExitoPedido('');
    setErrorPedido('');
    setEnviando(true);
    try {
      const items = carrito.map((p) => ({ producto_id: p.id, cantidad: 1 }));
      await api.post('/pedidos', { items }); // async/await + promesa
      setExitoPedido('¡Pedido realizado con éxito!');
      setCarrito([]);
    } catch (err) {
      setErrorPedido(err.response?.data?.mensaje || 'No se pudo crear el pedido');
    } finally {
      setEnviando(false);
    }
  }

  // Total del carrito (lógica de datos)
  const totalCarrito = carrito.reduce((sum, p) => sum + Number(p.precio), 0);

  // Agrupa productos por categoría (incluye 'todos' = inventario completo)
  const grupos = useMemo(() => {
    const productos = data?.productos || [];
    return CATEGORIAS.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      eyebrow: c.eyebrow,
      items: c.id === 'todos'
        ? productos
        : productos.filter((p) => p.categoria === c.id),
    }));
  }, [data]);

  // Convierte todo en páginas físicas (modelo capítulos)
  const paginas = useMemo(() => paginarContenido(grupos), [grupos]);

  // Una "hoja" muestra 2 páginas (izquierda 2h, derecha 2h+1)
  const totalHojas = Math.ceil(paginas.length / 2);

  // hoja actual (0 = primer par de páginas)
  const [hoja, setHoja] = useState(0);

  // Mapa: en qué hoja empieza cada categoría (para tabs y query param)
  const hojaDeCategoria = useMemo(() => {
    const mapa = {};
    paginas.forEach((p, idx) => {
      if (p.tipo === 'contenido' && p.mostrarTitulo && mapa[p.categoria] === undefined) {
        mapa[p.categoria] = Math.floor(idx / 2);
      }
    });
    return mapa;
  }, [paginas]);

  // Categorías que de verdad tienen páginas (para mostrar sus tabs)
  const categoriasVisibles = useMemo(
    () => CATEGORIAS.filter((c) => hojaDeCategoria[c.id] !== undefined),
    [hojaDeCategoria]
  );

  // Si la URL trae ?categoria=, saltar a su capítulo
  useEffect(() => {
    if (!categoriaUrl) return;
    const h = hojaDeCategoria[categoriaUrl];
    if (h !== undefined) setHoja(h);
  }, [categoriaUrl, hojaDeCategoria]);

  const siguiente = useCallback(() => {
    setHoja((h) => Math.min(h + 1, totalHojas - 1));
  }, [totalHojas]);

  const anterior = useCallback(() => {
    setHoja((h) => Math.max(h - 1, 0));
  }, []);

  function irACategoria(catId) {
    const h = hojaDeCategoria[catId];
    if (h !== undefined) {
      setHoja(h);
      setSearchParams({ categoria: catId });
    }
  }

  // useEffect: MONTAJE (teclado) + LIMPIEZA (removerlo)
  useEffect(() => {
    function alPresionarTecla(e) {
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
    }
    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [siguiente, anterior]);

  if (cargando) return <p style={{ padding: 24 }}>Cargando menú...</p>;
  if (error) return <div style={{ padding: 24 }}><Mensaje tipo="error" texto={error} /></div>;

  // Solo los logueados pueden agregar (si no, onAgregar = undefined)
  const onAgregar = estaLogueado ? agregarAlCarrito : undefined;

  // Qué categoría se está viendo (para resaltar el tab)
  const paginaIzq = paginas[hoja * 2];
  const categoriaActiva = paginaIzq?.tipo === 'contenido' ? paginaIzq.categoria : '';

  return (
    <div className="ml-root">
      <Estilos />
      <h1 className="ml-encabezado">Nuestro Menú</h1>
      <p className="ml-hint">✦ Usa las flechas o el teclado ←→ ✦</p>

      <div className="ml-tabs">
        {categoriasVisibles.map((c) => (
          <button
            key={c.id}
            className={`ml-tab ${categoriaActiva === c.id ? 'ml-tab--activa' : ''}`}
            style={{ '--tab-color': c.color }}
            onClick={() => irACategoria(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {/* El libro: dos páginas visibles (izq y der) calculadas según la hoja */}
      <div className="ml-libro">
        {/* Página IZQUIERDA (par): página 2*hoja */}
        <div className="ml-lado ml-lado--izq">
          <Pagina pagina={paginas[hoja * 2]} onAgregar={onAgregar} />
        </div>

        {/* Página DERECHA (impar): página 2*hoja+1 */}
        <div className="ml-lado ml-lado--der">
          <Pagina pagina={paginas[hoja * 2 + 1]} onAgregar={onAgregar} />
        </div>

        {/* Hojas animadas: una por cada par, encima de las bases.
            Cada hoja tiene su cara frontal (derecha) y trasera (izquierda). */}
        {Array.from({ length: totalHojas }).map((_, i) => {
          const volteada = hoja > i;
          return (
            <div
              key={i}
              className={`ml-hoja ${volteada ? 'ml-hoja--volteada' : ''}`}
              style={{ zIndex: volteada ? i : totalHojas - i }}
            >
              {/* Cara FRONTAL: página derecha de este par (impar) */}
              <div className="ml-cara ml-cara--frontal">
                <Pagina pagina={paginas[i * 2 + 1]} onAgregar={onAgregar} />
              </div>
              {/* Cara TRASERA: página izquierda del SIGUIENTE par (par) */}
              <div className="ml-cara ml-cara--trasera">
                <Pagina pagina={paginas[(i + 1) * 2]} onAgregar={onAgregar} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="ml-controles">
        <button className="ml-nav" onClick={anterior} disabled={hoja === 0} aria-label="Anterior">‹</button>
        <div className="ml-puntos">
          {Array.from({ length: totalHojas }).map((_, i) => (
            <span key={i} className={`ml-punto ${hoja === i ? 'ml-punto--activo' : ''}`} />
          ))}
        </div>
        <button className="ml-nav" onClick={siguiente} disabled={hoja >= totalHojas - 1} aria-label="Siguiente">›</button>
      </div>
      <p className="ml-paginacion">Páginas {hoja * 2 + 1} – {hoja * 2 + 2}</p>

      {/* Barra de pedido: solo si hay sesión */}
      {estaLogueado ? (
        <div className="ml-carrito">
          <div className="ml-carrito__info">
            <strong>Tu pedido</strong>
            <span className="ml-carrito__contador">
              {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} · ${totalCarrito.toFixed(0)}
            </span>
          </div>

          {/* Lista breve de lo agregado (renderizado de listas) */}
          {carrito.length > 0 && (
            <ul className="ml-carrito__lista">
              {carrito.map((p, i) => (
                <li key={`${p.id}-${i}`}>
                  <span>{p.nombre} — ${Number(p.precio).toFixed(0)}</span>
                  <button className="ml-carrito__quitar" onClick={() => quitarDelCarrito(i)} aria-label="Quitar">×</button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="ml-carrito__confirmar"
            onClick={confirmarPedido}
            disabled={carrito.length === 0 || enviando}
          >
            {enviando ? 'Enviando...' : 'Confirmar pedido'}
          </button>

          {/* Mensajes de éxito/error con tu componente */}
          <Mensaje tipo="exito" texto={exitoPedido} />
          <Mensaje tipo="error" texto={errorPedido} />
        </div>
      ) : (
        <p className="ml-aviso-login">Inicia sesión para poder ordenar.</p>
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,600&family=Cormorant+Garamond:ital@0;1&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .ml-root {
        --crema: #e8e0d6; --crema2: #f2ebe2;
        --cafe: #6e5556; --cafe2: #a3556a; --fondo: #5e4647;
        --serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
        --display: 'Playfair Display', Georgia, serif;
        min-height: 100%;
        background: radial-gradient(circle at 50% 0%, #7a5d5e, var(--fondo));
        color: #f2ebe2; font-family: var(--serif);
        padding: 130px 12px 40px; text-align: center;
      }
      .ml-encabezado {
        font-family: var(--display); font-style: italic; font-weight: 600;
        font-size: 52px; color: #f2ebe2; margin: 0 0 4px;
        text-shadow: 0 2px 12px rgba(0,0,0,.4);
      }
      .ml-hint { letter-spacing: 2px; font-size: 13px; text-transform: uppercase; color: #d9aeac; margin: 0 0 16px; }
      .ml-tabs { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; max-width: 760px; margin: 0 auto; position: relative; z-index: 5; }
      .ml-tab {
        border: none; cursor: pointer; color: #fff; padding: 8px 18px;
        font-family: inherit; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;
        background: color-mix(in srgb, var(--tab-color) 55%, #000);
        border-radius: 6px 6px 0 0; opacity: .75; transition: opacity .2s, transform .2s;
      }
      .ml-tab:hover { opacity: .95; }
      .ml-tab--activa { opacity: 1; background: var(--tab-color); }

      .ml-libro { position: relative; width: min(760px, 96vw); height: 520px; margin: 0 auto; perspective: 2200px; }
      .ml-lado { position: absolute; top: 0; width: 50%; height: 100%; background: var(--crema); overflow: hidden; }
      .ml-lado--izq { left: 0; border-radius: 0 0 0 6px; background: linear-gradient(90deg, var(--crema), var(--crema2)); }
      .ml-lado--der { right: 0; border-radius: 0 0 6px 0; background: linear-gradient(90deg, var(--crema2), #f8f3ec); }

      .ml-hoja {
        position: absolute; top: 0; right: 0; width: 50%; height: 100%;
        transform-style: preserve-3d; transform-origin: left center;
        transition: transform .65s cubic-bezier(.4,.15,.2,1);
      }
      .ml-hoja--volteada { transform: rotateY(-180deg); }
      .ml-cara { position: absolute; inset: 0; backface-visibility: hidden; overflow: hidden; }
      .ml-cara--frontal {
        background: linear-gradient(90deg, var(--crema2), #f8f3ec);
        border-radius: 0 6px 6px 0; box-shadow: inset 6px 0 14px -8px rgba(0,0,0,.25);
      }
      .ml-cara--trasera {
        transform: rotateY(180deg);
        background: linear-gradient(90deg, var(--crema), var(--crema2));
        border-radius: 6px 0 0 6px; box-shadow: inset -6px 0 14px -8px rgba(0,0,0,.25);
      }

      .ml-pagina { position: relative; height: 100%; box-sizing: border-box; padding: 34px 32px; color: var(--cafe); text-align: left; display: flex; flex-direction: column; overflow: hidden; }
      .ml-pagina--portada { justify-content: center; align-items: center; text-align: center; }
      .ml-pagina--vacia { justify-content: center; align-items: center; }
      .ml-portada__titulo { font-size: 26px; line-height: 1.25; color: var(--cafe); margin: 0 0 10px; }
      .ml-portada__sub { font-style: italic; color: var(--cafe2); margin: 0; }
      .ml-eyebrow { color: #a3556a; letter-spacing: 2px; font-size: 11px; text-transform: uppercase; margin: 0 0 4px; }
      .ml-titulo { font-family: var(--display); font-style: italic; font-size: 32px; margin: 0 0 18px; color: var(--cafe); border-bottom: 1px solid #dcc0bc; padding-bottom: 8px; }
      .ml-items { display: flex; flex-direction: column; gap: 22px; }
      .ml-item { display: flex; align-items: flex-start; gap: 12px; }
      .ml-item--agotado { opacity: .5; }
      .ml-item__icono { font-size: 22px; width: 34px; height: 34px; display: grid; place-items: center; background: #e6cdb0; border-radius: 50%; flex: none; }
      .ml-item__texto { flex: 1; }
      .ml-item__nombre { margin: 0; font-size: 15px; letter-spacing: .5px; text-transform: uppercase; color: var(--cafe); display: flex; align-items: center; gap: 8px; }
      .ml-item__link { color: inherit; text-decoration: none; transition: color .15s; cursor: pointer; }
      .ml-item__link:hover { color: #a3556a; text-decoration: underline; text-underline-offset: 3px; }
      .ml-item__tag { font-size: 9px; letter-spacing: .5px; background: #b34a3a; color: #fff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
      .ml-item__desc { margin: 2px 0 0; font-size: 13px; color: #9c7d76; font-style: italic; }
      .ml-item__derecha { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex: none; }
      .ml-item__precio { color: #a3556a; font-weight: bold; font-size: 15px; }
      .ml-item__agregar {
        border: 1px solid #a3556a; background: #a3556a; color: #f2ebe2;
        font-family: inherit; font-size: 11px; letter-spacing: .5px;
        padding: 4px 10px; border-radius: 5px; cursor: pointer; white-space: nowrap;
        transition: background .15s, transform .15s;
      }
      .ml-item__agregar:hover:not(:disabled) { background: #7a4453; transform: translateY(-1px); }
      .ml-item__agregar:disabled { opacity: .4; cursor: not-allowed; background: #9a8a78; border-color: #9a8a78; }

      .ml-carrito {
        max-width: 760px; margin: 18px auto 0; padding: 14px 18px;
        background: #5e4647; border: 1px solid #a8827c; border-radius: 10px;
        text-align: left; color: #f2ebe2;
      }
      .ml-carrito__info { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
      .ml-carrito__info strong { font-size: 16px; color: #f2ebe2; }
      .ml-carrito__contador { font-size: 13px; color: #d9aeac; }
      .ml-carrito__lista { list-style: none; margin: 10px 0; padding: 0; display: flex; flex-direction: column; gap: 6px; max-height: 110px; overflow-y: auto; }
      .ml-carrito__lista li { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #dcc0bc; border-bottom: 1px dashed #6e5556; padding-bottom: 4px; }
      .ml-carrito__quitar { background: none; border: none; color: #c98a7a; font-size: 18px; line-height: 1; cursor: pointer; padding: 0 4px; }
      .ml-carrito__quitar:hover { color: #e26a52; }
      .ml-carrito__confirmar {
        margin-top: 10px; width: 100%; padding: 10px; border: none; border-radius: 6px;
        background: #a3556a; color: #fff; font-family: inherit; font-size: 14px;
        letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: background .2s;
      }
      .ml-carrito__confirmar:hover:not(:disabled) { background: #8a4459; }
      .ml-carrito__confirmar:disabled { opacity: .45; cursor: not-allowed; }
      .ml-aviso-login { color: #d9aeac; font-style: italic; margin-top: 18px; }
      .ml-folio { position: absolute; bottom: 14px; right: 22px; font-size: 12px; color: #c3a8a4; }
      .ml-pagina--portada .ml-folio { left: 22px; right: auto; }
      .ml-fin { font-style: italic; color: var(--cafe2); }

      .ml-controles { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 22px 0 6px; }
      .ml-nav { width: 38px; height: 38px; border-radius: 50%; border: 1px solid #a8827c; background: #5e4647; color: #f2ebe2; font-size: 20px; cursor: pointer; transition: background .2s; }
      .ml-nav:hover:not(:disabled) { background: #6e5556; }
      .ml-nav:disabled { opacity: .35; cursor: default; }
      .ml-puntos { display: flex; gap: 8px; }
      .ml-punto { width: 9px; height: 9px; border-radius: 50%; background: #a8827c; transition: background .2s; }
      .ml-punto--activo { background: #dcc0bc; }
      .ml-paginacion { letter-spacing: 2px; font-size: 12px; text-transform: uppercase; color: #d9aeac; }

      @media (prefers-reduced-motion: reduce) { .ml-hoja { transition: none; } }
    `}</style>
    </>
  );
}

export default MenuLibro;