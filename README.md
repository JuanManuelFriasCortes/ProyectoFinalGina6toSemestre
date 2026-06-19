# Cafetería MOMO — Proyecto Full Stack (React + Node.js + MySQL)

App Full Stack para la cafetería MOMO (Aguascalientes). Permite ver el menú,
registrarse, iniciar sesión, hacer pedidos y administrar el catálogo.

> El diseño visual está intencionalmente **pelón** (HTML sin estilos) para que
> el encargado de diseño le aplique CSS después. Toda la lógica programable
> (funciones, hooks, APIs, auth, routing, BD) ya está implementada.

## Estructura

```
momo/
├── backend/    -> Node + Express + MySQL (APIs REST, auth, tokens)
└── frontend/   -> React + Vite (consume las APIs)
```

## 1. Base de datos (MySQL)

1. Abre MySQL y ejecuta el script:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
   Esto crea la BD `momo_db` con las tablas `usuarios`, `productos`,
   `pedidos`, `detalle_pedido` y productos de ejemplo.

2. Genera los usuarios de prueba (admin + 2 clientes) con contraseñas hasheadas:
   ```bash
   cd backend
   npm install
   npm run seed:hash
   ```
   Copia el `INSERT` que imprime y ejecútalo en MySQL.

   **Credenciales de prueba (para el PDF):**
   | Rol     | Email           | Contraseña  |
   |---------|-----------------|-------------|
   | admin   | admin@momo.com  | admin123    |
   | cliente | ana@momo.com    | cliente123  |
   | cliente | luis@momo.com   | cliente123  |

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # edita .env con tus datos de MySQL y un JWT_SECRET
npm run dev              # arranca en http://localhost:4000
```

### APIs REST disponibles (más de 5 ✓)
| Método | Ruta                      | Acceso        | Acción            |
|--------|---------------------------|---------------|-------------------|
| POST   | /api/auth/register        | público       | registro          |
| POST   | /api/auth/login           | público       | login (da token)  |
| GET    | /api/auth/perfil          | token         | perfil            |
| GET    | /api/productos            | público       | CONSULTA          |
| GET    | /api/productos/:id        | público       | CONSULTA por id   |
| POST   | /api/productos            | admin         | ALTA              |
| PUT    | /api/productos/:id        | admin         | CAMBIO            |
| DELETE | /api/productos/:id        | admin         | BAJA              |
| POST   | /api/pedidos              | token         | crear pedido      |
| GET    | /api/pedidos/mios         | token         | mis pedidos       |
| GET    | /api/pedidos              | admin         | todos los pedidos |
| PUT    | /api/pedidos/:id/estado   | admin         | cambiar estado    |

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:4000/api
npm run dev              # arranca en http://localhost:5173
```

## 4. Deploy (resumen)

- **Backend + MySQL:** Railway o Render (ambos dan MySQL gratis).
  Sube el repo, configura las variables de entorno (las de `.env`).
- **Frontend:** Vercel o Netlify. Configura `VITE_API_URL` apuntando
  a la URL pública del backend.
- En el backend, pon `CLIENT_URL` con la URL pública del frontend (CORS).

## Roles del equipo
- Juan Manuek Frías Cortes -- Jefe de Equipo (Full Stack)
- Eliseo Villalobos Reveles -- BackEnd
- Ramiro Vazquez Lopes  -- BackEnd
- Sara Alexandra Chamorro Cuevas -- FrontEnd
