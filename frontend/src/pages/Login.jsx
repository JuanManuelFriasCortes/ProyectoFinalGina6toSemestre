// ============================================
// PÁGINA: Login
// FORMULARIO CONTROLADO (cada input ligado a useState) con validaciones.
// Demuestra: useState, formulario controlado + validaciones,
// async/await, estados de carga/éxito/error, eventos, consumo de API.
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Mensaje from '../components/Mensaje';

function Login() {
  // Estado local de cada campo (formulario CONTROLADO)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados de UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validación en el FRONTEND antes de mandar
  function validar() {
    if (!email.includes('@')) return 'Ingresa un email válido';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setCargando(true);
      const { data } = await api.post('/auth/login', { email, password });
      login(data); // guarda token + usuario en el estado global
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Estado de carga */}
        <button type="submit" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Mensaje de error en la interfaz (no alert) */}
      <Mensaje tipo="error" texto={error} />
    </div>
  );
}

export default Login;
