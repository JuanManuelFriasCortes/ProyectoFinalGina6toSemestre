// ============================================
// HOOK PERSONALIZADO: useAuth
// Atajo para consumir el AuthContext sin importar useContext
// en cada componente. Demuestra: hook personalizado + estado global.
// ============================================
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
