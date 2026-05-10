const express = require('express');
const router = express.Router();
const { obtenerKPIs } = require('../controllers/dashboardController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/dashboard/kpis', verificarToken, obtenerKPIs);

module.exports = router;