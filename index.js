require('dotenv').config();
const express = require('express');
const app = express();

// Conexión a la base de datos
const pool = require('./src/config/db');

// Middleware PRIMERO
app.use(express.json());

// Importar rutas
const empresaRoutes = require('./src/routes/empresaRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api', empresaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Ruta para probar conexión a BD
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Levantar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});