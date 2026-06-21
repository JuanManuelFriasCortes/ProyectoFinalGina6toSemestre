// ============================================
// PÁGINA: Registro
// FORMULARIO NO CONTROLADO (useRef) con validaciones.
// La rúbrica pide explícitamente un formulario no controlado con useRef.
// Demuestra: useRef, formulario NO controlado + validaciones,
// async/await, estados éxito/error, consumo de API, componentes funcionales.
//
// Diseño: mismo "clipboard" que el Login, sobre el fondo del Inicio.
// ============================================
import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Mensaje from '../components/Mensaje';

function Registro() {
  // useRef: leemos el valor del input directo del DOM (NO controlado)
  const nombreRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  function validar(nombre, email, password) {
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (!email.includes('@')) return 'Ingresa un email válido';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    setExito('');

    // Leemos los valores SOLO al enviar (característica del no controlado)
    const nombre = nombreRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const errorValidacion = validar(nombre, email, password);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setCargando(true);
      await api.post('/auth/register', { nombre, email, password });
      // Mensaje de retroalimentación (en la vista, no alert)
      setExito('Usuario registrado correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo registrar el usuario');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-root">
      <Estilos />

      {/* Clipboard */}
      <div className="clip">
        <div className="clip__clip" aria-hidden />
        <div className="clip__hoja">
          <h2 className="clip__titulo">Crear cuenta</h2>
          <p className="clip__sub">Únete a Cafetería MOMO</p>

          <form onSubmit={manejarSubmit} className="clip__form">
            <div className="campo">
              <label>Nombre</label>
              <input type="text" ref={nombreRef} placeholder="Tu nombre" />
            </div>
            <div className="campo">
              <label>Email</label>
              <input type="email" ref={emailRef} placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="campo">
              <label>Contraseña</label>
              <input type="password" ref={passwordRef} placeholder="Mínimo 6 caracteres" />
            </div>

            <button type="submit" className="clip__btn" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>

          <div className="clip__msg">
            <Mensaje tipo="exito" texto={exito} />
            <Mensaje tipo="error" texto={error} />
          </div>

          <p className="clip__pie">
            ¿Ya tienes cuenta? <Link to="/login" className="clip__link">Inicia sesión</Link>
          </p>
        </div>
        <div className="clip__esquina" aria-hidden />
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
      .auth-root {
        min-height: 100vh;
        background: linear-gradient(135deg, #f2ebe2 0%, #e8e0d6 60%, #dcc8c0 100%);
        font-family: 'Cormorant Garamond', Georgia, serif;
        padding: 130px 16px 50px;
        display: flex; justify-content: center; align-items: flex-start;
      }

      .clip {
        position: relative;
        width: min(420px, 100%);
        background: linear-gradient(160deg, #bd9774, #a8785a);
        border-radius: 14px;
        padding: 30px 26px 26px;
        box-shadow: 0 18px 40px rgba(94,70,71,.4);
      }
      .clip__clip {
        position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
        width: 96px; height: 30px;
        background: linear-gradient(180deg, #4a4a4a, #2b2b2b);
        border-radius: 7px;
        box-shadow: 0 4px 8px rgba(0,0,0,.35);
        z-index: 3;
      }
      .clip__clip::after {
        content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
        width: 60px; height: 8px; background: #5e5e5e; border-radius: 4px;
      }

      .clip__hoja {
        position: relative; z-index: 2;
        background: #fbf8f2;
        border-radius: 6px;
        padding: 34px 28px 26px;
        box-shadow: inset 0 2px 5px rgba(0,0,0,.05);
      }

      .clip__titulo {
        font-family: 'Playfair Display', serif; font-style: italic; font-weight: 600;
        font-size: 30px; color: #a3556a; margin: 0 0 4px; text-align: center;
      }
      .clip__sub { text-align: center; color: #a8827c; font-size: 15px; margin: 0 0 22px; }

      .clip__form { display: flex; flex-direction: column; gap: 16px; }
      .campo { display: flex; flex-direction: column; gap: 6px; }
      .campo label { font-size: 12px; letter-spacing: .5px; text-transform: uppercase; color: #a8827c; }
      .campo input {
        background: #fff; border: 1px solid #e0d3c8; border-radius: 8px;
        color: #5e4647; padding: 11px 13px; font-family: inherit; font-size: 15px;
      }
      .campo input:focus { outline: none; border-color: #c98e92; }
      .campo input::placeholder { color: #c2b3ac; }

      .clip__btn {
        margin-top: 6px; border: none; cursor: pointer;
        background: #a3556a; color: #fff; font-family: inherit;
        font-size: 15px; letter-spacing: 1px; text-transform: uppercase;
        padding: 12px; border-radius: 8px; transition: background .2s, transform .15s;
      }
      .clip__btn:hover:not(:disabled) { background: #8a4459; transform: translateY(-1px); }
      .clip__btn:disabled { opacity: .6; cursor: default; }

      .clip__msg { text-align: center; margin-top: 12px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
      .clip__pie { text-align: center; color: #a8827c; font-size: 14px; margin: 18px 0 0; }
      .clip__link { color: #a3556a; font-weight: 600; text-decoration: none; }
      .clip__link:hover { text-decoration: underline; text-underline-offset: 3px; }

      .clip__esquina {
        position: absolute; bottom: 26px; right: 26px;
        width: 0; height: 0; z-index: 2;
        border-style: solid; border-width: 0 0 26px 26px;
        border-color: transparent transparent #a8785a transparent;
        border-bottom-right-radius: 6px;
        filter: drop-shadow(-2px -2px 3px rgba(0,0,0,.15));
      }
      `}</style>
    </>
  );
}

export default Registro;