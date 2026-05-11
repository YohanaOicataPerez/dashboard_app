require('dotenv').config();
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

const authRoutes = require('../src/routes/authRoutes');
const empresaRoutes = require('../src/routes/empresaRoutes');
app.use('/api/auth', authRoutes);
app.use('/api', empresaRoutes);

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'yohana@dashboard.com', password: '123456' });
  token = res.body.token;
});

describe('Módulo de Empresas', () => {

  test('GET /api/empresas - debe fallar sin token', async () => {
    const res = await request(app).get('/api/empresas');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/empresas - debe devolver lista con token válido', async () => {
    const res = await request(app)
      .get('/api/empresas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/empresas - debe crear una empresa', async () => {
    const res = await request(app)
      .post('/api/empresas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Empresa Jest Test',
        sector: 'Tecnología'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nombre');
  });

});