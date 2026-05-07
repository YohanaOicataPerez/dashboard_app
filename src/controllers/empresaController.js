const pool = require('../config/db');

const obtenerEmpresas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empresas ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en obtenerEmpresas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener empresas' });
  }
};

const crearEmpresa = async (req, res) => {
  try {
    const { nombre, sector, nit, email_contacto } = req.body;

    // Validación mínima
    if (!nombre || !sector) {
      return res.status(400).json({ mensaje: 'nombre y sector son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO empresas (nombre, sector, nit, email_contacto)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, sector, nit || null, email_contacto || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en crearEmpresa:', error.message);
    res.status(500).json({ mensaje: 'Error al crear empresa' });
  }
};

module.exports = {
  obtenerEmpresas,
  crearEmpresa,
};