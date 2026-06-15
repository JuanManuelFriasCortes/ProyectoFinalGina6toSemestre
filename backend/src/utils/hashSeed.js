// ============================================
// Utilidad: genera los hashes bcrypt de los usuarios de prueba
// y arma el INSERT listo para pegar en MySQL.
//
// Uso:  node src/utils/hashSeed.js
//
// ¿Por qué? Nunca guardamos contraseñas en texto plano. bcrypt las
// convierte en un hash irreversible. Aquí generamos los hashes de los
// usuarios semilla (admin + 2 clientes) que pides en la rúbrica.
// ============================================
const bcrypt = require('bcryptjs');

const usuarios = [
  { nombre: 'Administrador MOMO', email: 'admin@momo.com', plano: 'admin123',   rol: 'admin' },
  { nombre: 'Ana López',          email: 'ana@momo.com',   plano: 'cliente123', rol: 'cliente' },
  { nombre: 'Luis García',        email: 'luis@momo.com',  plano: 'cliente123', rol: 'cliente' },
];

(async () => {
  console.log('\n-- Copia este INSERT y ejecútalo en MySQL:\n');
  const valores = [];
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.plano, 10);
    valores.push(`('${u.nombre}', '${u.email}', '${hash}', '${u.rol}')`);
  }
  console.log(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES\n  " +
    valores.join(',\n  ') + ';\n'
  );
  console.log('-- Contraseñas en texto plano (para login / PDF):');
  usuarios.forEach((u) => console.log(`--   ${u.email} -> ${u.plano}`));
})();
