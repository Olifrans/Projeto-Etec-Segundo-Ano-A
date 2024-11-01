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
