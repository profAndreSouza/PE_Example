const { test } = require('node:test');
const assert = require('node:assert/strict');

const apiUrl = process.env.API_URL || 'http://localhost:8080/api';

async function waitForApi() {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${apiUrl}/usuarios?page=0&size=1`);
      if (response.ok) return;
      lastError = new Error(`API respondeu HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`API não ficou disponível em ${apiUrl}`, { cause: lastError });
}

test('CRUD da API valida usuários, projetos, paginação e erros', async () => {
  await waitForApi();

  const email = `qa-${Date.now()}@example.test`;
  let usuarioId;
  let projetoId;

  try {
    const listResponse = await fetch(`${apiUrl}/usuarios?page=0&size=2`);
    assert.equal(listResponse.status, 200);
    const page = await listResponse.json();
    assert.ok(Array.isArray(page.content));
    assert.equal(page.size, 2);

    const invalidUserResponse = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: '', email: 'invalido', tipo: 'ALUNO' }),
    });
    assert.equal(invalidUserResponse.status, 400);

    const createUserResponse = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Usuário Teste de Integração',
        email,
        tipo: 'PROFESSOR',
        status: 'ATIVO',
      }),
    });
    assert.equal(createUserResponse.status, 201);
    const usuario = await createUserResponse.json();
    usuarioId = usuario.id;

    const duplicateResponse = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Duplicado',
        email,
        tipo: 'ALUNO',
      }),
    });
    assert.equal(duplicateResponse.status, 400);

    const missingUserResponse = await fetch(`${apiUrl}/usuarios/999999999`);
    assert.equal(missingUserResponse.status, 404);

    const missingCoordinatorResponse = await fetch(`${apiUrl}/projetos-extensao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Projeto sem coordenador',
        descricao: 'Teste de referência inexistente',
        coordenadorId: 999999999,
        dataInicio: '2026-01-01',
      }),
    });
    assert.equal(missingCoordinatorResponse.status, 404);

    const projetoResponse = await fetch(`${apiUrl}/projetos-extensao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Projeto de Integração API',
        descricao: 'Cenário automatizado de teste integrado',
        coordenadorId: usuarioId,
        status: 'EM_ANALISE',
        dataInicio: '2026-01-01',
        dataFim: '2026-12-31',
      }),
    });
    assert.equal(projetoResponse.status, 201);
    const projeto = await projetoResponse.json();
    projetoId = projeto.id;
    assert.equal(projeto.coordenadorId, usuarioId);

    const invalidDatesResponse = await fetch(`${apiUrl}/projetos-extensao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Projeto com datas inválidas',
        descricao: 'A data fim precede o início',
        coordenadorId: usuarioId,
        dataInicio: '2026-12-31',
        dataFim: '2026-01-01',
      }),
    });
    assert.equal(invalidDatesResponse.status, 400);
  } finally {
    if (projetoId) {
      const deleteProjectResponse = await fetch(`${apiUrl}/projetos-extensao/${projetoId}`, {
        method: 'DELETE',
      });
      assert.equal(deleteProjectResponse.status, 204);
    }
    if (usuarioId) {
      const deleteUserResponse = await fetch(`${apiUrl}/usuarios/${usuarioId}`, {
        method: 'DELETE',
      });
      assert.equal(deleteUserResponse.status, 204);
    }
  }
});
