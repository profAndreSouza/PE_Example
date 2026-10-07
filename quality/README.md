# Módulo de Qualidade (QA & Testes) — `PE_Example`

Este diretório armazena a **estratégia transversal de testes**, coleções de testes de API e modelos de relatórios de evidências.

## 📁 Estrutura de Conteúdos

- `docs/`: Estratégias de qualidade, pirâmide de testes e matrizes de aceitação.
- `templates/`: Modelos padronizados de relatos de defeito e evidências de testes para os alunos.
- `tests/api/`: Coleções de testes automatizados HTTP (Postman / Newman).

## 🚀 Como Executar os Testes de API

### Pré-requisitos
- Node.js instalado.
- Backend Spring Boot rodando na porta `8080`.

### Rodar a Suíte de API com Newman

```bash
cd quality
npm install
npm run test:api
```
