// ============================================
// PUNTO DE ENTRADA de la app React
// Envuelve TODO en <AuthProvider> para que el estado global de
// autenticación esté disponible en cualquier componente.
// ============================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
