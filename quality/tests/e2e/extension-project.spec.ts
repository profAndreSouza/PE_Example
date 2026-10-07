import { expect, test } from '@playwright/test';

test('cadastra usuário e projeto de extensão associado', async ({ page, request }) => {
  const apiUrl = process.env.API_URL || 'http://localhost:8080/api';
  const email = `e2e-${Date.now()}@example.test`;
  let usuarioId: number | undefined;
  let projetoId: number | undefined;

  try {
    await page.goto('/');
    await page.getByPlaceholder('Ex: Maria Silva').fill('Usuário Jornada E2E');
    await page.getByPlaceholder('maria@senai.br').fill(email);
    await page.getByRole('button', { name: 'Cadastrar Usuário' }).click();

    const usuarioCriado = await request.get(`${apiUrl}/usuarios?busca=${encodeURIComponent(email)}`);
    expect(usuarioCriado.ok()).toBeTruthy();
    const usuariosPage = await usuarioCriado.json();
    usuarioId = usuariosPage.content.find((usuario: { email: string }) => usuario.email === email)?.id;
    expect(usuarioId).toBeTruthy();
    await expect(page.getByText('Usuário cadastrado com sucesso!')).toBeVisible();

    await page.getByRole('button', { name: /Projetos de Extensão/ }).click();
    await page.getByPlaceholder('Ex: Inclusão Digital').fill('Projeto Jornada E2E');
    await page.getByPlaceholder('Descrição detalhada do projeto...').fill('Projeto associado ao usuário criado na jornada.');
    await page.locator('select').first().selectOption(String(usuarioId));
    await page.locator('input[type="date"]').first().fill('2026-01-01');
    await page.getByRole('button', { name: 'Cadastrar Projeto' }).click();

    const projetoCriado = await request.get(`${apiUrl}/projetos-extensao?busca=${encodeURIComponent('Projeto Jornada E2E')}`);
    expect(projetoCriado.ok()).toBeTruthy();
    const projetosPage = await projetoCriado.json();
    const projeto = projetosPage.content.find(
      (item: { titulo: string; coordenadorId: number }) =>
        item.titulo === 'Projeto Jornada E2E' && item.coordenadorId === usuarioId,
    );
    expect(projeto).toBeTruthy();
    projetoId = projeto.id;
    await expect(page.getByText('Projeto cadastrado com sucesso!')).toBeVisible();
  } finally {
    if (projetoId) await request.delete(`${apiUrl}/projetos-extensao/${projetoId}`);
    if (usuarioId) await request.delete(`${apiUrl}/usuarios/${usuarioId}`);
  }
});
