# Módulo de Qualidade (QA & Testes) — `PE_Example`

Este diretório armazena a **estratégia transversal de testes**, coleções de testes de API e modelos de relatórios de evidências.

## 📁 Estrutura de Conteúdos

- `docs/`: Estratégias de qualidade, pirâmide de testes e matrizes de aceitação.
- `templates/`: Modelos padronizados de relatos de defeito e evidências de testes para os alunos.
- `tests/api/`: testes automatizados HTTP da API e coleção importável no Postman.
- `tests/e2e/`: Jornadas de ponta a ponta da interface com Playwright.

## Camadas de teste

- `backend/src/test`: testes unitários de Service e testes MVC de Controller, implementados e mantidos pela equipe Quality e executados pelo Maven com JUnit/Mockito.
- `quality/tests/api`: testes HTTP contra a API real e o banco; verificam status, validação, regras de negócio e associação.
- `quality/tests/e2e`: testes de navegador que atravessam frontend, API e PostgreSQL.

O local `backend/src/test` é uma convenção técnica do Maven: os testes Java precisam compilar junto ao projeto e importar seus tipos. Isso não transfere sua autoria à equipe Backend. Neste projeto, Quality define e implementa os testes unitários e de controller; Backend esclarece regras e apoia a testabilidade do código de produção.

DevOps é responsável por configurar e manter os workflows que executam os testes. Por exemplo, `backend-ci.yml` executa `mvn clean verify`, que compila e roda os testes Java escritos por Quality; `quality-ci.yml` executa os testes HTTP e E2E. A equipe responsável pelo código analisa falhas conforme a causa: Quality para asserção/cenário, Backend para comportamento de produção e DevOps para configuração do pipeline.

Para executar somente os testes Java em um container Maven, use `docker compose --profile tests run --rm backend-tests` na raiz.

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
