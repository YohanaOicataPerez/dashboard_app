const express = require('express');
const router = express.Router();

const { obtenerEmpresas, crearEmpresa } = require('../controllers/empresaController');

router.get('/empresas', obtenerEmpresas);
router.post('/empresas', crearEmpresa);

module.exports = router;