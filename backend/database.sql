-- ============================================
-- BASE DE DATOS: Cafetería MOMO (Aguascalientes)
-- ============================================
-- Ejecuta este script en MySQL para crear la BD.
-- Cubre: usuarios (con rol), productos (menú), pedidos y detalle_pedido.

CREATE DATABASE IF NOT EXISTS momo_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE momo_db;

-- --------------------------------------------
-- Tabla: usuarios
-- rol = 'admin' o 'cliente' -> controla los 3 niveles de acceso
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)        NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password      VARCHAR(255)        NOT NULL,  -- se guarda hasheada (bcrypt)
  rol           ENUM('admin','cliente') NOT NULL DEFAULT 'cliente',
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Tabla: productos (el menú de la cafetería)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)   NOT NULL,
  descripcion   VARCHAR(255),
  categoria     VARCHAR(60)    NOT NULL DEFAULT 'general', -- cafe, pan, postre...
  precio        DECIMAL(10,2)  NOT NULL,
  disponible    TINYINT(1)     NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Tabla: pedidos (cabecera del pedido de un usuario)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT            NOT NULL,
  total         DECIMAL(10,2)  NOT NULL DEFAULT 0,
  estado        ENUM('pendiente','preparando','listo','entregado','cancelado')
                               NOT NULL DEFAULT 'pendiente',
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- --------------------------------------------
-- Tabla: detalle_pedido (productos dentro de un pedido)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id     INT            NOT NULL,
  producto_id   INT            NOT NULL,
  cantidad      INT            NOT NULL DEFAULT 1,
  precio_unit   DECIMAL(10,2)  NOT NULL,
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ============================================
-- DATOS DE PRUEBA (seed)
-- ============================================
-- IMPORTANTE: estas contraseñas están hasheadas con bcrypt.
-- Texto plano para que las uses en el login / PDF:
--   admin@momo.com    -> admin123
--   ana@momo.com      -> cliente123
--   luis@momo.com     -> cliente123
-- (Genera tú los hashes con: node src/utils/hashSeed.js  — ver más abajo)

-- Productos de ejemplo del menú MOMO
INSERT INTO productos (nombre, descripcion, categoria, precio, disponible) VALUES
('Espresso',        'Café espresso sencillo',           'cafe',   35.00, 1),
('Capuchino',       'Espresso con leche espumada',      'cafe',   48.00, 1),
('Latte',           'Café con leche cremoso',           'cafe',   50.00, 1),
('Concha',          'Pan dulce tradicional',            'pan',    18.00, 1),
('Croissant',       'Cuerno de mantequilla',            'pan',    32.00, 1),
('Cheesecake',      'Rebanada de pastel de queso',      'postre', 65.00, 1),
('Chai Latte',      'Té chai con leche',                'cafe',   52.00, 1);
