# 🗺️ MAPA DE LA RÚBRICA → dónde está cada punto

Guía para el video: en cada punto te digo **archivo (código)** y **dónde se ve (vista)**.

## Funcionalidad del sistema
| Punto rúbrica | Código | Vista |
|---|---|---|
| Registro funcionando + mensaje | `pages/Registro.jsx` | /registro |
| Login funcionando | `pages/Login.jsx` | /login |
| Interfaz admin | `pages/PanelAdmin.jsx` | /admin (logueado como admin) |
| Interfaz usuario logueado | `pages/MisPedidos.jsx`, `pages/Menu.jsx` | /mis-pedidos |
| Interfaz nadie logueado | `pages/Inicio.jsx`, `pages/Menu.jsx` | / y /menu sin sesión |
| ALTA en BD | `PanelAdmin.jsx` (crear) + `productoController.crear` | /admin form "Nuevo producto" |
| BAJA en BD | `PanelAdmin.jsx` (eliminar) + `productoController.eliminar` | /admin botón Eliminar |
| CAMBIO en BD | `PanelAdmin.jsx` (editar) + `productoController.actualizar` | /admin botón Editar |
| CONSULTA | `Menu.jsx` + `productoController.listar` | /menu |

## Temas de React (código + vista)
| Tema | Archivo | Vista donde se aprecia |
|---|---|---|
| Componentes funcionales | casi todos (`ProductoCard`, `Menu`...) | toda la app |
| Props entre componentes | `ProductoCard.jsx` (recibe `producto`) | /menu |
| PropTypes | `ProductoCard.jsx`, `Mensaje.jsx`, `RutaProtegida.jsx` | — |
| useState | `Login.jsx`, `PanelAdmin.jsx` | formularios |
| useEffect montaje | `PanelAdmin.jsx` (carga inicial), `AuthContext.jsx` | /admin al entrar |
| useEffect actualización | `useFetch.js` (dep `[url]`) | /menu al cambiar filtro |
| useEffect limpieza | `useFetch.js` (`return () => activo=false`) | al salir de /menu |
| Hooks personalizados | `hooks/useAuth.js`, `hooks/useFetch.js`, `hooks/useCarrito.js` | — |
| Estado global | `context/AuthContext.jsx` | navbar muestra usuario |
| Manejo de eventos | `Navbar.jsx` (logout), `ProductoCard.jsx` (onClick) | botones |
| Funciones anidadas | `ProductoCard.jsx` (`formatearPrecio`→`aNumero`) | /menu |
| Promesas | `useFetch.js`, controladores | — |
| async/await | `Login.jsx`, `PanelAdmin.jsx`, todos los controllers | — |
| Consumo API (axios) | `services/api.js` + cualquier página | /menu carga datos |
| Estado carga | `Menu.jsx` ("Cargando menú...") | /menu al abrir |
| Estado éxito (sin alert) | `Mensaje.jsx` tipo éxito | /registro tras registrar |
| Estado error (sin alert) | `Mensaje.jsx` tipo error | /login con datos malos |
| Formulario controlado + validación | `Login.jsx`, `PanelAdmin.jsx` | /login, /admin |
| Formulario NO controlado (useRef) | `Registro.jsx` | /registro |
| Renderizado de listas | `Menu.jsx` (`.map`) | /menu |
| Renderizado condicional | `Inicio.jsx`, `Navbar.jsx` | navbar según rol |
| Rutas con parámetros | `App.jsx` (`/menu/:id`) + `DetalleProducto.jsx` | /menu/1 |
| Query params | `Menu.jsx` (`useSearchParams`) | /menu?categoria=cafe |
| Rutas anidadas | `App.jsx` (dentro de `<Layout>`) + `Layout.jsx` (`<Outlet/>`) | toda la app |
| NavLink | `Navbar.jsx` | navbar (enlace activo en negrita) |
| children | `Layout.jsx`, `RutaProtegida.jsx`, `AuthContext.jsx` | — |
| Rutas protegidas | `RutaProtegida.jsx` + `App.jsx` | /admin sin ser admin → redirige |
| Error 404 | `NoEncontrado.jsx` + `App.jsx` (`path="*"`) | /cualquier-cosa-rara |
| Lazy loading | `App.jsx` (`lazy(() => import('./pages/PanelAdmin'))`) | /admin (Network: chunk aparte) |
| **Aportación 1: Error Boundary** | `components/ErrorBoundary.jsx` | envolver un componente y forzar error |
| **Aportación 2: useReducer + useMemo** | `hooks/useCarrito.js` | carrito del menú (total memorizado) |

## Backend (mostrar en código)
| Punto | Archivo |
|---|---|
| Arquitectura rutas/controladores/middlewares | estructura `src/` |
| Las rutas | `routes/*.js` |
| Auth y autorización (flujo) | `controllers/authController.js` + `middlewares/auth.js` |
| Rutas protegidas | `middlewares/auth.verificarToken` usado en `routes/` |
| Tokens | `authController.generarToken` + `middlewares/auth.js` |
| Códigos HTTP | todos los controllers (200, 201, 400, 401, 403, 404, 409, 500) |
| Validaciones backend | `validators/index.js` + `middlewares/validarCampos.js` |
| Conexión a BD | `config/db.js` |
| APIs que trabajan con BD | `controllers/*.js` (queries) |
| Ciclo completo React→API→front | Login.jsx → /api/auth/login → authController → BD → token → front |

## ⚠️ Recordatorios para no perder puntos
- El PDF debe estar 100% listo ANTES de grabar.
- Todos los integrantes con cámara prendida al inicio y participando.
- Las conclusiones (React vs Angular) las escribe CADA integrante, NO la IA.
- No modifiques la rúbrica (penalización -20).
- Sube TODO a GitHub (front y back) y haz el deploy temprano.
