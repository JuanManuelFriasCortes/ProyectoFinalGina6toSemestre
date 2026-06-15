// ============================================
// PÁGINA: Registro
// FORMULARIO NO CONTROLADO (useRef) con validaciones.
// La rúbrica pide explícitamente un formulario no controlado con useRef.
// Demuestra: useRef, formulario NO controlado + validaciones,
// async/await, estados éxito/error, consumo de API.
// ============================================
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // Mensaje de retroalimentación "Usuario registrado" (en la vista, no alert)
      setExito('Usuario registrado correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo registrar el usuario');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h2>Crear cuenta</h2>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" ref={nombreRef} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" ref={emailRef} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" ref={passwordRef} />
        </div>
        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>

      <Mensaje tipo="exito" texto={exito} />
      <Mensaje tipo="error" texto={error} />
    </div>
  );
}

export default Registro;
