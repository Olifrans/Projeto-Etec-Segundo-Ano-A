


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
