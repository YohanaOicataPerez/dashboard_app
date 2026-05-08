const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'nombre, email y password son obligatorios' });
    }

    const usuarioExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1', [email]
    );
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES ($1, $2, $3) RETURNING id, nombre, email, rol`,
      [nombre, email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'email y password son obligatorios' });
    }

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = { registro, login };