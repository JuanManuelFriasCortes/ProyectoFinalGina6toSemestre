// ============================================
// PÁGINA: MisPedidos (usuario logueado)
// Muestra los pedidos del usuario actual.
// Demuestra: ruta protegida (se monta dentro de RutaProtegida),
// renderizado de listas, estados, hook useFetch.
// ============================================
import { useFetch } from '../hooks/useFetch';
import Mensaje from '../components/Mensaje';

function MisPedidos() {
  const { data, cargando, error } = useFetch('/pedidos/mios');

  if (cargando) return <p>Cargando tus pedidos...</p>;
  if (error) return <Mensaje tipo="error" texto={error} />;

  const pedidos = data?.pedidos || [];

  return (
    <div>
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Aún no tienes pedidos.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>#</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>${Number(p.total).toFixed(2)}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.creado_en).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MisPedidos;
