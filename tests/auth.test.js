require('dotenv').config();

const request = require('supertest');
const express = require('express');

// Configurar app de prueba
const app = express();
app.use(express.json());

const authRoutes = require('../src/routes/authRoutes');
app.use('/api/auth', authRoutes);

describe('Módulo de Autenticación', () => {

  test('POST /api/auth/registro - debe registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        nombre: 'Usuario Test',
        email: `test_${Date.now()}@test.com`,
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('nombre');
  });

  test('POST /api/auth/registro - debe fallar si faltan campos', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ email: 'incompleto@test.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('POST /api/auth/login - debe fallar con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('POST /api/auth/login - debe devolver token con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'yohana@dashboard.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

});