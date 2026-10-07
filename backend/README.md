# Módulo de Backend — `PE_Example`

API RESTful desenvolvida em **Java 21** e **Spring Boot 3**, provendo serviços de cadastro e consulta para Usuários e Projetos de Extensão.

## 📁 Arquitetura do Pacote

- `model/`: Entidades JPA (`Usuario`, `ProjetoExtensao`) e Enums de domínio.
- `dto/`: Objetos de transferência de dados (`Request` e `Response`).
- `repository/`: Interfaces `JpaRepository` com consultas ao PostgreSQL.
- `service/`: Regras de negócio, validações e transformações de modelo para DTO.
- `controller/`: Endpoints REST (`/api/usuarios` e `/api/projetos-extensao`).
- `exception/`: Tratamento centralizado de exceções (`@RestControllerAdvice`).

## 🚀 Como Executar

### Pré-requisitos
- JDK 21+ instalado.
- Banco de dados PostgreSQL rodando (via `banco_dados/compose.yaml`).

### Executar a Aplicação Localmente

```bash
mvn spring-boot:run
```

A API estará acessível em: `http://localhost:8080`

### Rodar Testes Unitários

```bash
mvn test
```

## 📋 Endpoints Disponíveis

### Usuários (`/api/usuarios`)
- `GET /api/usuarios`: Lista todos os usuários.
- `GET /api/usuarios/{id}`: Detalhes de um usuário por ID.
- `POST /api/usuarios`: Cadastra um novo usuário.
- `PUT /api/usuarios/{id}`: Atualiza os dados de um usuário.
- `DELETE /api/usuarios/{id}`: Remove um usuário.

### Projetos de Extensão (`/api/projetos-extensao`)
- `GET /api/projetos-extensao`: Lista todos os projetos.
- `GET /api/projetos-extensao/{id}`: Detalhes de um projeto por ID.
- `POST /api/projetos-extensao`: Cadastra um novo projeto.
- `PUT /api/projetos-extensao/{id}`: Atualiza os dados de um projeto.
- `DELETE /api/projetos-extensao/{id}`: Remove um projeto.
