const express = require('express');
const bodyParser = require('body-parser');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api/alunos', alunoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
