const express = require('express');
const app = express();

// Conexión a la base de datos
const pool = require('./src/config/db');

// Importar rutas
const empresaRoutes = require('./src/routes/empresaRoutes');

// Middleware
app.use(express.json());

// Rutas principales
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