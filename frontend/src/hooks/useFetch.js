// ============================================
// HOOK PERSONALIZADO: useFetch
// Encapsula el patrón de pedir datos a una API manejando los
// tres estados: CARGA (loading), ÉXITO (data) y ERROR.
// Demuestra de un solo golpe varios puntos de la rúbrica:
//   - hook personalizado
//   - promesas / async-await
//   - estados de carga, éxito y error
//   - useEffect con MONTAJE, ACTUALIZACIÓN y LIMPIEZA de efectos
// ============================================
import { useState, useEffect } from 'react';
import api from '../services/api';
 
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 'activo' evita actualizar el estado si el componente se desmonta
    // mientras la petición sigue en curso (LIMPIEZA de efectos).
    let activo = true;

    async function obtenerDatos() {
      try {
        setCargando(true);
        setError(null);
        const respuesta = await api.get(url); // async/await + promesa
        if (activo) {
          setData(respuesta.data);
        }
      } catch (err) {
        if (activo) {
          setError(err.response?.data?.mensaje || 'Error al cargar los datos');
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    obtenerDatos();

    // Función de LIMPIEZA: se ejecuta al desmontar o antes de re-ejecutar
    return () => {
      activo = false;
    };
  }, [url]); // se re-ejecuta cuando cambia 'url' -> ACTUALIZACIÓN

  return { data, cargando, error };
}
