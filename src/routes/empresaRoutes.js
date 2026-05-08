const express = require('express');
const router = express.Router();
const { obtenerEmpresas, crearEmpresa } = require('../controllers/empresaController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/empresas', verificarToken, obtenerEmpresas);
router.post('/empresas', verificarToken, crearEmpresa);

module.exports = router;