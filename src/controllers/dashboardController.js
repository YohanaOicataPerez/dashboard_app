const pool = require('../config/db');

const obtenerKPIs = async (req, res) => {
  try {
    const empresa_id = 1;

    // Total de ventas
    const totalVentas = await pool.query(
      `SELECT SUM(cantidad * precio_unitario) as total_ventas
       FROM datos_ventas WHERE empresa_id = $1`,
      [empresa_id]
    );

    // Total de unidades vendidas
    const totalUnidades = await pool.query(
      `SELECT SUM(cantidad) as total_unidades
       FROM datos_ventas WHERE empresa_id = $1`,
      [empresa_id]
    );

    // Ventas por producto
    const ventasPorProducto = await pool.query(
      `SELECT producto, 
              SUM(cantidad) as unidades,
              SUM(cantidad * precio_unitario) as ingresos
       FROM datos_ventas WHERE empresa_id = $1
       GROUP BY producto ORDER BY ingresos DESC`,
      [empresa_id]
    );

    // Ventas por canal
    const ventasPorCanal = await pool.query(
      `SELECT canal,
              SUM(cantidad * precio_unitario) as ingresos
       FROM datos_ventas WHERE empresa_id = $1
       GROUP BY canal ORDER BY ingresos DESC`,
      [empresa_id]
    );

    // Ventas por mes
    const ventasPorMes = await pool.query(
      `SELECT TO_CHAR(fecha, 'YYYY-MM') as mes,
              SUM(cantidad * precio_unitario) as ingresos
       FROM datos_ventas WHERE empresa_id = $1
       GROUP BY mes ORDER BY mes ASC`,
      [empresa_id]
    );

    res.json({
      total_ventas: totalVentas.rows[0].total_ventas,
      total_unidades: totalUnidades.rows[0].total_unidades,
      ventas_por_producto: ventasPorProducto.rows,
      ventas_por_canal: ventasPorCanal.rows,
      ventas_por_mes: ventasPorMes.rows
    });

  } catch (error) {
    console.error('Error en obtenerKPIs:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener KPIs' });
  }
};

module.exports = { obtenerKPIs };