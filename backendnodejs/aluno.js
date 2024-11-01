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
