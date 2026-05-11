# Dashboard App - Backend

API REST para plataforma de dashboards empresariales orientada al análisis de marketing y datos.

## Descripción

Aplicación web backend desarrollada en Node.js con Express y PostgreSQL que permite a pequeñas empresas cargar sus datos de ventas, visualizar KPIs y tomar decisiones basadas en datos.

## Tecnologías utilizadas

- **Runtime:** Node.js v24.14.1
- **Framework:** Express v5.2.1
- **Base de datos:** PostgreSQL 18
- **Autenticación:** JSON Web Tokens (JWT)
- **Encriptación:** bcryptjs
- **Carga de archivos:** Multer
- **Procesamiento CSV:** csv-parse
- **ORM/Driver:** pg (node-postgres)
- **Variables de entorno:** dotenv
- **Testing:** Jest + Supertest
- **Control de versiones:** Git + GitHub

## Estructura del proyecto
backend-dashboard/
├── index.js
├── package.json
├── .env.example
├── .gitignore
├── tests/
│   ├── auth.test.js
│   └── empresas.test.js
└── src/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── empresaController.js
│   ├── datosController.js
│   └── dashboardController.js
├── middlewares/
│   └── authMiddleware.js
└── routes/
├── authRoutes.js
├── empresaRoutes.js
├── datosRoutes.js
└── dashboardsRoutes.js

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL 14 o superior
- npm v8 o superior

## Instalación - Ambiente de desarrollo

**1. Clonar el repositorio:**
```bash
git clone https://github.com/YohanaOicataPerez/dashboard_app.git
cd dashboard_app
```

**2. Instalar dependencias:**
```bash
npm install
```

**3. Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
DB_USER=tu_usuario_postgres
DB_HOST=localhost
DB_NAME=dashboard_app
DB_PASSWORD=tu_password
DB_PORT=5432
PORT=3000
JWT_SECRET=tu_clave_secreta

**4. Crear la base de datos en PostgreSQL:**
```sql
CREATE DATABASE dashboard_app;
```

**5. Crear las tablas:**
```sql
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  sector VARCHAR(100),
  nit VARCHAR(20),
  email_contacto VARCHAR(150),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'usuario',
  empresa_id INTEGER REFERENCES empresas(id),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE datos_ventas (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  fecha DATE,
  producto VARCHAR(150),
  cantidad INTEGER,
  precio_unitario NUMERIC(10,2),
  cliente VARCHAR(150),
  canal VARCHAR(50),
  fecha_carga TIMESTAMP DEFAULT NOW()
);
```

**6. Iniciar el servidor:**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints disponibles

### Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/registro | Registrar usuario | No |
| POST | /api/auth/login | Iniciar sesión | No |

### Empresas
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/empresas | Listar empresas | Sí |
| POST | /api/empresas | Crear empresa | Sí |

### Datos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /api/datos/subir | Subir archivo CSV | Sí |
| GET | /api/datos | Obtener datos cargados | Sí |

### Dashboard
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/dashboard/kpis | Obtener KPIs de ventas | Sí |

## Autenticación

Las rutas protegidas requieren un token JWT en el header:
Authorization: Bearer <token>

El token se obtiene al hacer login exitoso.

## Pruebas

```bash
npm test
```

Resultado esperado: 7 pruebas pasadas en 2 suites.

## Ambiente de pruebas

- **Sistema operativo:** macOS
- **Node.js:** v24.14.1
- **PostgreSQL:** 18 (puerto 5433)
- **Puerto del servidor:** 3000
- **Herramienta de pruebas de API:** Postman

## Seguridad

- Contraseñas encriptadas con bcryptjs (salt rounds: 10)
- Autenticación mediante JWT con expiración de 8 horas
- Variables de entorno para credenciales sensibles
- Rutas protegidas con middleware de verificación de token