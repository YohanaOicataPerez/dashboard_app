const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { subirCSV, obtenerDatos } = require('../controllers/datosController');
const { verificarToken } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  }
});

router.post('/datos/subir', verificarToken, upload.single('archivo'), subirCSV);
router.get('/datos', verificarToken, obtenerDatos);

module.exports = router;