# Plano e Estratégia de Qualidade de Software — `PE_Example`

## 1. Visão Geral
Este documento orienta os alunos sobre a pirâmide de testes e como garantir a qualidade do produto através de testes contínuos e evidências auditáveis.

## 2. Pirâmide de Testes no Projeto

```
       / \
      /E2E\       -> Testes de Interface UI (Playwright/Cypress)
     /-----\
    /  API  \     -> Testes de Contrato & Regras de Negócio REST (Newman/RestAssured)
   /---------\
  / Unitários \   -> Testes Unitários de Métodos & Funções (JUnit 5 / Mockito)
 /-------------\
```

- **Testes Unitários**: Devem cobrir a lógica das camadas `Service` e `Controller` no backend (cobertura mínima recomendada: 80%).
- **Testes de API**: Validam respostas de status HTTP (200, 201, 400, 404) e corpo do JSON de resposta.
- **Testes E2E**: Garantem que a navegação do aluno/professor no frontend interaja corretamente com a API e o banco de dados.

## 3. Matriz de Rastreabilidade de Testes

| ID Caso | Módulo | Requisito | Tipo de Teste | Critério de Aceitação |
| :--- | :--- | :--- | :--- | :--- |
| CT-001 | Usuários | Impedir e-mail duplicado | Unitário / API | Retornar erro HTTP 400 com mensagem explicativa |
| CT-002 | Projetos | Impedir coordenador inativo | Unitário / API | Lançar BusinessException e bloquear o cadastro |
| CT-003 | Projetos | Data fim < Data início | Unitário / API | Validar datas e rejeitar requisição |
