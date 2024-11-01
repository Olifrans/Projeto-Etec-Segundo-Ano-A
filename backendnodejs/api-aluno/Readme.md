


Para criar uma API Node.js com a entidade `Aluno` contendo as propriedades `Id`, `Nome` e `Idade`, vamos utilizar o framework **Express** para gerenciar as rotas e **MySQL** como banco de dados. Aqui está o passo a passo:

1. **Configuração do projeto**  
   No terminal, inicie um novo projeto Node.js e instale as dependências necessárias:

   ```bash
   mkdir api-aluno
   cd api-aluno
   npm init -y
   npm install express mysql2 body-parser
   ```

2. **Estrutura do Projeto**  
   Organize a estrutura do projeto para que fique mais fácil de manter:

   ```
   api-aluno/
   ├── config/
   │   └── db.js         # Configuração do banco de dados
   ├── controllers/
   │   └── alunoController.js # Controlador da entidade Aluno
   ├── models/
   │   └── alunoModel.js # Modelo Aluno com consultas SQL
   ├── routes/
   │   └── alunoRoutes.js    # Rotas para a entidade Aluno
   ├── app.js           # Arquivo principal
   └── package.json
   ```

3. **Configuração do Banco de Dados (config/db.js)**  
   Configure o banco de dados para a conexão com o MySQL:

   ```javascript
   const mysql = require('mysql2');

   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'sua_senha', // Altere para a senha do seu banco de dados
     database: 'aluno_db'
   });

   db.connect((err) => {
     if (err) {
       console.error('Erro ao conectar ao banco de dados:', err);
     } else {
       console.log('Conectado ao banco de dados MySQL');
     }
   });

   module.exports = db;
   ```

4. **Modelo da Entidade Aluno (models/alunoModel.js)**  
   Crie as funções de CRUD para a entidade `Aluno`:

   ```javascript
   const db = require('../config/db');

   const Aluno = {
     getAll: (callback) => {
       db.query('SELECT * FROM alunos', callback);
     },

     getById: (id, callback) => {
       db.query('SELECT * FROM alunos WHERE id = ?', [id], callback);
     },

     create: (aluno, callback) => {
       db.query('INSERT INTO alunos (nome, idade) VALUES (?, ?)', [aluno.nome, aluno.idade], callback);
     },

     update: (id, aluno, callback) => {
       db.query('UPDATE alunos SET nome = ?, idade = ? WHERE id = ?', [aluno.nome, aluno.idade, id], callback);
     },

     delete: (id, callback) => {
       db.query('DELETE FROM alunos WHERE id = ?', [id], callback);
     }
   };

   module.exports = Aluno;
   ```

5. **Controlador da Entidade Aluno (controllers/alunoController.js)**  
   Defina as funções que irão gerenciar as requisições HTTP:

   ```javascript
   const Aluno = require('../models/alunoModel');

   exports.getAllAlunos = (req, res) => {
     Aluno.getAll((err, results) => {
       if (err) res.status(500).json({ error: err });
       else res.status(200).json(results);
     });
   };

   exports.getAlunoById = (req, res) => {
     Aluno.getById(req.params.id, (err, results) => {
       if (err) res.status(500).json({ error: err });
       else res.status(200).json(results[0]);
     });
   };

   exports.createAluno = (req, res) => {
     const novoAluno = { nome: req.body.nome, idade: req.body.idade };
     Aluno.create(novoAluno, (err, results) => {
       if (err) res.status(500).json({ error: err });
       else res.status(201).json({ id: results.insertId, ...novoAluno });
     });
   };

   exports.updateAluno = (req, res) => {
     const alunoAtualizado = { nome: req.body.nome, idade: req.body.idade };
     Aluno.update(req.params.id, alunoAtualizado, (err) => {
       if (err) res.status(500).json({ error: err });
       else res.status(200).json({ message: 'Aluno atualizado com sucesso' });
     });
   };

   exports.deleteAluno = (req, res) => {
     Aluno.delete(req.params.id, (err) => {
       if (err) res.status(500).json({ error: err });
       else res.status(200).json({ message: 'Aluno excluído com sucesso' });
     });
   };
   ```

6. **Definição das Rotas (routes/alunoRoutes.js)**  
   Mapeie as rotas para as funções do controlador:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const alunoController = require('../controllers/alunoController');

   router.get('/', alunoController.getAllAlunos);
   router.get('/:id', alunoController.getAlunoById);
   router.post('/', alunoController.createAluno);
   router.put('/:id', alunoController.updateAluno);
   router.delete('/:id', alunoController.deleteAluno);

   module.exports = router;
   ```

7. **Arquivo Principal (app.js)**  
   Configure o servidor Express para usar o `body-parser` e importar as rotas.

   ```javascript
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
   ```

8. **Configuração do Banco de Dados**  
   No MySQL, crie o banco e a tabela `alunos`:

   ```sql
   CREATE DATABASE aluno_db;

   USE aluno_db;

   CREATE TABLE alunos (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     idade INT NOT NULL
   );
   ```

Agora a API está pronta! Execute o projeto com:

```bash
node app.js
```

- **GET** `/api/alunos` para listar todos os alunos.
- **GET** `/api/alunos/:id` para obter um aluno específico.
- **POST** `/api/alunos` para criar um novo aluno.
- **PUT** `/api/alunos/:id` para atualizar um aluno existente.
- **DELETE** `/api/alunos/:id` para excluir um aluno.












# Front End

Para criar um frontend simples em HTML e JavaScript que consuma a API Node.js que acabamos de configurar, vamos criar um formulário para cadastrar alunos, além de exibir uma lista com os dados dos alunos, usando **Fetch API** para realizar as requisições HTTP.

Aqui está o código básico:

1. **Estrutura do HTML (index.html)**

   ```html
   <!DOCTYPE html>
   <html lang="pt-BR">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Cadastro de Alunos</title>
     <link rel="stylesheet" href="styles.css">
   </head>
   <body>
     <h1>Cadastro de Alunos</h1>

     <div id="form-container">
       <h2>Adicionar Novo Aluno</h2>
       <form id="alunoForm">
         <input type="text" id="nome" placeholder="Nome" required>
         <input type="number" id="idade" placeholder="Idade" required>
         <button type="submit">Cadastrar Aluno</button>
       </form>
     </div>

     <div id="alunos-container">
       <h2>Lista de Alunos</h2>
       <table>
         <thead>
           <tr>
             <th>ID</th>
             <th>Nome</th>
             <th>Idade</th>
             <th>Ações</th>
           </tr>
         </thead>
         <tbody id="alunos-list"></tbody>
       </table>
     </div>

     <script src="script.js"></script>
   </body>
   </html>
   ```

2. **Estilos CSS (styles.css)**  
   Um pouco de estilo para tornar a interface mais apresentável:

   ```css
   body {
     font-family: Arial, sans-serif;
     text-align: center;
     margin: 0;
     padding: 20px;
     background-color: #f4f4f9;
   }

   h1, h2 {
     color: #333;
   }

   #form-container, #alunos-container {
     max-width: 500px;
     margin: 20px auto;
     padding: 20px;
     background: #fff;
     border-radius: 8px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
   }

   input, button {
     padding: 10px;
     margin: 5px;
     width: 100%;
     box-sizing: border-box;
   }

   table {
     width: 100%;
     border-collapse: collapse;
     margin-top: 20px;
   }

   th, td {
     padding: 10px;
     border: 1px solid #ddd;
   }

   button {
     background-color: #28a745;
     color: #fff;
     border: none;
     cursor: pointer;
   }

   button:hover {
     background-color: #218838;
   }
   ```

3. **JavaScript para Interações e Requisições HTTP (script.js)**  
   Aqui vamos fazer as chamadas à API para listar, criar, atualizar e deletar alunos:

   ```javascript
   const apiUrl = 'http://localhost:3000/api/alunos';

   // Função para obter a lista de alunos
   async function fetchAlunos() {
     const response = await fetch(apiUrl);
     const alunos = await response.json();
     const alunosList = document.getElementById('alunos-list');
     alunosList.innerHTML = '';
     alunos.forEach(aluno => {
       const row = document.createElement('tr');
       row.innerHTML = `
         <td>${aluno.id}</td>
         <td>${aluno.nome}</td>
         <td>${aluno.idade}</td>
         <td>
           <button onclick="deleteAluno(${aluno.id})">Excluir</button>
           <button onclick="updateAluno(${aluno.id}, '${aluno.nome}', ${aluno.idade})">Editar</button>
         </td>
       `;
       alunosList.appendChild(row);
     });
   }

   // Função para criar um novo aluno
   document.getElementById('alunoForm').addEventListener('submit', async (e) => {
     e.preventDefault();
     const nome = document.getElementById('nome').value;
     const idade = document.getElementById('idade').value;

     await fetch(apiUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ nome, idade })
     });
     document.getElementById('alunoForm').reset();
     fetchAlunos();
   });

   // Função para deletar um aluno
   async function deleteAluno(id) {
     await fetch(`${apiUrl}/${id}`, {
       method: 'DELETE'
     });
     fetchAlunos();
   }

   // Função para atualizar um aluno
   async function updateAluno(id, nome, idade) {
     const newNome = prompt('Novo nome:', nome);
     const newIdade = prompt('Nova idade:', idade);
     if (newNome && newIdade) {
       await fetch(`${apiUrl}/${id}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ nome: newNome, idade: parseInt(newIdade) })
       });
       fetchAlunos();
     }
   }

   // Carrega a lista de alunos quando a página é carregada
   window.onload = fetchAlunos;
   ```

### Explicação das Funções:

- **fetchAlunos**: Realiza um GET na API para buscar todos os alunos e exibi-los na tabela.
- **Criação de Aluno**: Captura os dados do formulário, envia um POST à API e atualiza a lista.
- **deleteAluno**: Envia um DELETE para a API usando o `id` do aluno.
- **updateAluno**: Permite editar o nome e a idade de um aluno usando um prompt e envia um PUT à API para atualizar os dados.

### Rodando o Frontend

Basta abrir o arquivo `index.html` em um navegador, com a API rodando localmente. A interface permitirá listar, adicionar, atualizar e excluir alunos diretamente a partir do frontend.






# Frontend

Para criar um frontend simples em HTML e JavaScript que consuma a API Node.js que acabamos de configurar, vamos criar um formulário para cadastrar alunos, além de exibir uma lista com os dados dos alunos, usando **Fetch API** para realizar as requisições HTTP.

Aqui está o código básico:

1. **Estrutura do HTML (index.html)**

   ```html
   <!DOCTYPE html>
   <html lang="pt-BR">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Cadastro de Alunos</title>
     <link rel="stylesheet" href="styles.css">
   </head>
   <body>
     <h1>Cadastro de Alunos</h1>

     <div id="form-container">
       <h2>Adicionar Novo Aluno</h2>
       <form id="alunoForm">
         <input type="text" id="nome" placeholder="Nome" required>
         <input type="number" id="idade" placeholder="Idade" required>
         <button type="submit">Cadastrar Aluno</button>
       </form>
     </div>

     <div id="alunos-container">
       <h2>Lista de Alunos</h2>
       <table>
         <thead>
           <tr>
             <th>ID</th>
             <th>Nome</th>
             <th>Idade</th>
             <th>Ações</th>
           </tr>
         </thead>
         <tbody id="alunos-list"></tbody>
       </table>
     </div>

     <script src="script.js"></script>
   </body>
   </html>
   ```

2. **Estilos CSS (styles.css)**  
   Um pouco de estilo para tornar a interface mais apresentável:

   ```css
   body {
     font-family: Arial, sans-serif;
     text-align: center;
     margin: 0;
     padding: 20px;
     background-color: #f4f4f9;
   }

   h1, h2 {
     color: #333;
   }

   #form-container, #alunos-container {
     max-width: 500px;
     margin: 20px auto;
     padding: 20px;
     background: #fff;
     border-radius: 8px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
   }

   input, button {
     padding: 10px;
     margin: 5px;
     width: 100%;
     box-sizing: border-box;
   }

   table {
     width: 100%;
     border-collapse: collapse;
     margin-top: 20px;
   }

   th, td {
     padding: 10px;
     border: 1px solid #ddd;
   }

   button {
     background-color: #28a745;
     color: #fff;
     border: none;
     cursor: pointer;
   }

   button:hover {
     background-color: #218838;
   }
   ```

3. **JavaScript para Interações e Requisições HTTP (script.js)**  
   Aqui vamos fazer as chamadas à API para listar, criar, atualizar e deletar alunos:

   ```javascript
   const apiUrl = 'http://localhost:3000/api/alunos';

   // Função para obter a lista de alunos
   async function fetchAlunos() {
     const response = await fetch(apiUrl);
     const alunos = await response.json();
     const alunosList = document.getElementById('alunos-list');
     alunosList.innerHTML = '';
     alunos.forEach(aluno => {
       const row = document.createElement('tr');
       row.innerHTML = `
         <td>${aluno.id}</td>
         <td>${aluno.nome}</td>
         <td>${aluno.idade}</td>
         <td>
           <button onclick="deleteAluno(${aluno.id})">Excluir</button>
           <button onclick="updateAluno(${aluno.id}, '${aluno.nome}', ${aluno.idade})">Editar</button>
         </td>
       `;
       alunosList.appendChild(row);
     });
   }

   // Função para criar um novo aluno
   document.getElementById('alunoForm').addEventListener('submit', async (e) => {
     e.preventDefault();
     const nome = document.getElementById('nome').value;
     const idade = document.getElementById('idade').value;

     await fetch(apiUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ nome, idade })
     });
     document.getElementById('alunoForm').reset();
     fetchAlunos();
   });

   // Função para deletar um aluno
   async function deleteAluno(id) {
     await fetch(`${apiUrl}/${id}`, {
       method: 'DELETE'
     });
     fetchAlunos();
   }

   // Função para atualizar um aluno
   async function updateAluno(id, nome, idade) {
     const newNome = prompt('Novo nome:', nome);
     const newIdade = prompt('Nova idade:', idade);
     if (newNome && newIdade) {
       await fetch(`${apiUrl}/${id}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ nome: newNome, idade: parseInt(newIdade) })
       });
       fetchAlunos();
     }
   }

   // Carrega a lista de alunos quando a página é carregada
   window.onload = fetchAlunos;
   ```

### Explicação das Funções:

- **fetchAlunos**: Realiza um GET na API para buscar todos os alunos e exibi-los na tabela.
- **Criação de Aluno**: Captura os dados do formulário, envia um POST à API e atualiza a lista.
- **deleteAluno**: Envia um DELETE para a API usando o `id` do aluno.
- **updateAluno**: Permite editar o nome e a idade de um aluno usando um prompt e envia um PUT à API para atualizar os dados.

### Rodando o Frontend

Basta abrir o arquivo `index.html` em um navegador, com a API rodando localmente. A interface permitirá listar, adicionar, atualizar e excluir alunos diretamente a partir do frontend.

















back atualizado:



Para que o backend seja mais compatível com o frontend que criamos, vamos implementar **CORS (Cross-Origin Resource Sharing)**, que permite que o frontend acesse o backend mesmo se eles estiverem em servidores diferentes. Também vamos garantir que as rotas e os métodos HTTP estejam em conformidade com as operações de CRUD que o frontend usa.

Aqui estão as etapas para atualizar o backend para que ele funcione corretamente com o frontend:

### 1. Instalar e Configurar o CORS

Primeiro, precisamos instalar o pacote `cors`:

```bash
npm install cors
```

Depois, vamos configurar o middleware CORS no arquivo principal (`app.js` ou `server.js`) para permitir que o frontend se conecte ao backend.

### 2. Atualizar `app.js` para Configurar o CORS

No arquivo principal do seu servidor Node.js (`app.js` ou `server.js`), importe e configure o CORS, permitindo o acesso ao backend a partir de qualquer origem (ou uma específica, se preferir).

```javascript
const express = require('express');
const cors = require('cors'); // Importe o CORS

const app = express();
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Suporte a JSON

// Configuração das rotas da API
const alunos = []; // Array para armazenar os alunos

// Rota para obter todos os alunos
app.get('/api/alunos', (req, res) => {
  res.json(alunos);
});

// Rota para adicionar um novo aluno
app.post('/api/alunos', (req, res) => {
  const { nome, idade } = req.body;
  const novoAluno = { id: alunos.length + 1, nome, idade };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// Rota para atualizar um aluno
app.put('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;
  const aluno = alunos.find((a) => a.id == id);

  if (aluno) {
    aluno.nome = nome;
    aluno.idade = idade;
    res.json(aluno);
  } else {
    res.status(404).json({ message: 'Aluno não encontrado' });
  }
});

// Rota para deletar um aluno
app.delete('/api/alunos/:id', (req, res) => {
  const { id } = req.params;
  const index = alunos.findIndex((a) => a.id == id);

  if (index !== -1) {
    const alunoRemovido = alunos.splice(index, 1);
    res.json(alunoRemovido[0]);
  } else {
    res.status(404).json({ message: 'Aluno não encontrado' });
  }
});

// Configuração do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### Explicação das Modificações

1. **CORS**: Com o `app.use(cors())`, o backend permite o acesso do frontend por padrão. Se precisar restringir a uma origem específica, você pode configurá-la assim:

   ```javascript
   app.use(cors({ origin: 'http://localhost:5500' })); // Altere para o endereço do frontend
   ```

2. **Rotas e Respostas**: Cada rota responde com um JSON, o que facilita a leitura dos dados pelo frontend. Usamos:
   - **GET `/api/alunos`** para listar os alunos.
   - **POST `/api/alunos`** para adicionar um novo aluno.
   - **PUT `/api/alunos/:id`** para atualizar um aluno específico.
   - **DELETE `/api/alunos/:id`** para excluir um aluno específico.

3. **Métodos e Status HTTP**: Cada método retorna o status HTTP apropriado, como `201` para criação e `404` para erros de "não encontrado".

### Testando o Backend com o Frontend

Agora, com o CORS habilitado e as rotas funcionando, você deve conseguir consumir a API diretamente no frontend (por exemplo, acessando pelo `http://localhost:3000/api/alunos`).

Com essa configuração, o frontend em HTML e JavaScript poderá interagir corretamente com a API Node.js para criar, atualizar, listar e excluir alunos.