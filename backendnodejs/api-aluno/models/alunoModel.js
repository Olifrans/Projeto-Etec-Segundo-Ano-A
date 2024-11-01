




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
