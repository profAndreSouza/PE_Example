# Módulo de Qualidade (QA & Testes) — `PE_Example`

Este diretório armazena a **estratégia transversal de testes**, coleções de testes de API e modelos de relatórios de evidências.

## 📁 Estrutura de Conteúdos

- `docs/`: Estratégias de qualidade, pirâmide de testes e matrizes de aceitação.
- `templates/`: Modelos padronizados de relatos de defeito e evidências de testes para os alunos.
- `tests/api/`: Coleções de testes automatizados HTTP (Postman / Newman).
- `tests/e2e/`: Jornadas de ponta a ponta da interface com Playwright.

## Camadas de teste

- `backend/src/test`: testes unitários de Service e testes MVC de Controller, executados isoladamente com JUnit/Mockito.
- `quality/tests/api`: testes HTTP contra a API real e o banco; verificam status, validação, regras de negócio e associação.
- `quality/tests/e2e`: testes de navegador que atravessam frontend, API e PostgreSQL.

Essas suítes não são duplicadas: `backend` dá feedback rápido e localiza falhas de lógica Java; `quality` valida a integração dos componentes e os fluxos do ponto de vista do cliente.

## Executar API e E2E em Docker

Na raiz do repositório:

```bash
docker compose --profile quality run --build --rm quality
```

O Compose inicia também PostgreSQL, backend e frontend. O serviço de qualidade usa Playwright com Chromium e executa primeiro a API e depois a jornada E2E.

## Executar testes localmente

Com a stack disponível (`docker compose up --build -d`), instale as dependências em `quality/` e execute:

```bash
npm ci
npm run test:api
npx playwright install chromium
npm run test:e2e
```

`API_URL` (padrão `http://localhost:8080/api`) e `BASE_URL` (padrão `http://localhost:3000`) podem apontar para outros endereços.
