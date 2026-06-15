// ============================================
// CONTEXTO DE AUTENTICACIÓN  ->  ESTADO GLOBAL en React
// Guarda el usuario logueado y el token, y los hace disponibles
// para TODA la app sin pasar props manualmente (Context API).
// Demuestra: manejo de estado global.
// ============================================
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

// 1) Creamos el contexto
export const AuthContext = createContext(null);

// 2) Proveedor que envuelve la app
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // useEffect de MONTAJE: al iniciar la app, si hay token guardado,
  // recuperamos la sesión leyendo el usuario de localStorage.
  useEffect(() => {
    const token = localStorage.getItem('momo_token');
    const userGuardado = localStorage.getItem('momo_user');
    if (token && userGuardado) {
      setUsuario(JSON.parse(userGuardado));
    }
    setCargando(false);
  }, []); // [] -> solo al montar

  // Guarda sesión tras login
  function login(datos) {
    localStorage.setItem('momo_token', datos.token);
    localStorage.setItem('momo_user', JSON.stringify(datos.usuario));
    setUsuario(datos.usuario);
  }

  // Borra sesión
  function logout() {
    localStorage.removeItem('momo_token');
    localStorage.removeItem('momo_user');
    setUsuario(null);
  }

  const valor = {
    usuario,
    cargando,
    login,
    logout,
    esAdmin: usuario?.rol === 'admin',
    estaLogueado: !!usuario,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // demuestra: children + PropTypes
};
