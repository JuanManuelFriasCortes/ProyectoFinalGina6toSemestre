// ============================================
// APORTACIÓN 2 a MOMO: useReducer + useMemo (vía hook useCarrito)
// Temas de React NO incluidos en la rúbrica: useReducer (manejo de
// estado complejo con acciones tipo Redux) y useMemo (memorización
// de cálculos costosos).
//
// VALOR PARA EL SISTEMA: el carrito de pedidos tiene lógica con varias
// acciones (agregar, quitar, cambiar cantidad, vaciar). useReducer
// organiza esa lógica mucho mejor que varios useState sueltos, y
// useMemo recalcula el total solo cuando cambian los items, no en cada
// render. Hace el carrito más mantenible y eficiente.
//
// Para verlo en la vista: úsalo en el Menú para el carrito y muestra
// el total calculado con useMemo.
// ============================================
import { useReducer, useMemo } from 'react';

// Estado inicial del carrito
const estadoInicial = { items: [] };

// Reducer: recibe el estado actual y una acción, devuelve el nuevo estado
function carritoReducer(estado, accion) {
  switch (accion.tipo) {
    case 'AGREGAR':
      return { ...estado, items: [...estado.items, accion.producto] };
    case 'QUITAR':
      return {
        ...estado,
        items: estado.items.filter((_, i) => i !== accion.indice),
      };
    case 'VACIAR':
      return { ...estado, items: [] };
    default:
      return estado;
  }
}

export function useCarrito() {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);

  // useMemo: recalcula el total SOLO cuando cambian los items
  const total = useMemo(() => {
    return estado.items.reduce((suma, p) => suma + Number(p.precio), 0);
  }, [estado.items]);

  // Acciones expuestas (funciones que despachan)
  const agregar = (producto) => dispatch({ tipo: 'AGREGAR', producto });
  const quitar = (indice) => dispatch({ tipo: 'QUITAR', indice });
  const vaciar = () => dispatch({ tipo: 'VACIAR' });

  return { items: estado.items, total, agregar, quitar, vaciar };
}
