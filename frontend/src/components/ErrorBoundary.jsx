// ============================================
// APORTACIÓN 1 a MOMO: ERROR BOUNDARY
// Tema de React NO incluido en la rúbrica: componentes de CLASE con
// los métodos getDerivedStateFromError y componentDidCatch.
//
// VALOR PARA EL SISTEMA: si cualquier componente de la app truena
// (por ejemplo un dato inesperado de la API), en vez de mostrar
// una pantalla en blanco, MOMO muestra un mensaje amable y no se cae
// toda la aplicación. Mejora la robustez y la experiencia del usuario.
//
// Para verlo en la vista: envuelve componentes con <ErrorBoundary>.
// ============================================
import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hayError: false };
  }

  // Se ejecuta cuando un componente hijo lanza un error en el render
  static getDerivedStateFromError() {
    return { hayError: true };
  }

  // Aquí podrías registrar el error en un servicio de logs
  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó:', error, info);
  }

  render() {
    if (this.state.hayError) {
      return (
        <div style={{ border: '2px solid red', padding: '12px' }}>
          <h3>Algo salió mal ☕</h3>
          <p>Ocurrió un error inesperado. Recarga la página por favor.</p>
        </div>
      );
    }
    return this.props.children; // children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
