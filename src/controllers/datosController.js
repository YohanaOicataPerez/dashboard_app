const pool = require('../config/db');
const { parse } = require('csv-parse');
const fs = require('fs');

const subirCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ningún archivo' });
    }

    const empresa_id = req.body.empresa_id || 1;
    const registros = [];

    fs.createReadStream(req.file.path)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (row) => {
        registros.push(row);
      })
      .on('error', (error) => {
        console.error('Error al parsear CSV:', error.message);
        return res.status(400).json({ mensaje: 'Error al procesar CSV' });
      })
      .on('end', async () => {
        try {
          for (const row of registros) {
            await pool.query(
              `INSERT INTO datos_ventas (empresa_id, fecha, producto, cantidad, precio_unitario, cliente, canal)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [empresa_id, row.fecha, row.producto, parseInt(row.cantidad), parseFloat(row.precio_unitario), row.cliente, row.canal]
            );
          }
          fs.unlinkSync(req.file.path);
          res.status(201).json({ mensaje: 'Archivo procesado correctamente', registros_cargados: registros.length });
        } catch (error) {
          console.error('Error al insertar datos:', error.message);
          res.status(500).json({ mensaje: 'Error al guardar datos en la base de datos' });
        }
      });
  } catch (error) {
    console.error('Error en subirCSV:', error.message);
    res.status(500).json({ mensaje: 'Error al subir archivo' });
  }
};

const obtenerDatos = async (req, res) => {
  try {
    const empresa_id = req.body.empresa_id || 1;
    const result = await pool.query(
      'SELECT * FROM datos_ventas WHERE empresa_id = $1 ORDER BY fecha ASC',
      [empresa_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en obtenerDatos:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener datos' });
  }
};

module.exports = { subirCSV, obtenerDatos };