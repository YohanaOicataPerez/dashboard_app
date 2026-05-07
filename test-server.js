const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Servidor activo en puerto 3000');
});