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

### Executar a stack completa com Docker

Na raiz do repositório, suba o PostgreSQL, a API e o frontend:

```bash
docker compose up --build
```

A interface estará em `http://localhost:3000` e a API em `http://localhost:8080/api`. O datasource do backend usa o serviço `postgres` na rede interna do Compose.

### Pré-requisitos
- JDK 21+ instalado.
- Banco de dados PostgreSQL rodando (via `banco_dados/compose.yaml`).

### Executar a Aplicação Localmente

```bash
mvn spring-boot:run
```

A API estará acessível em: `http://localhost:8080`

### Rodar Testes Unitários

Neste projeto, a equipe Quality define e mantém os testes unitários e de controller. Os arquivos ficam em `src/test/java` por convenção do Maven e por precisarem compilar junto ao código Java. A equipe Backend esclarece as regras e apoia mudanças de testabilidade no código de produção. A pipeline que os executa é mantida pela equipe DevOps.

Com Docker, na raiz do repositório:

```bash
docker compose --profile tests run --rm backend-tests
```

Ou localmente, com JDK/Maven:

```bash
mvn test
```

## 📋 Endpoints Disponíveis

### Usuários (`/api/usuarios`)
- `GET /api/usuarios?page=0&size=10&busca=ana`: Lista usuários paginados e pesquisa por nome/e-mail. A resposta possui `content`, `totalElements`, `totalPages`, `number` e `size`.
- `GET /api/usuarios/{id}`: Detalhes de um usuário por ID.
- `POST /api/usuarios`: Cadastra um novo usuário.
- `PUT /api/usuarios/{id}`: Atualiza os dados de um usuário.
- `DELETE /api/usuarios/{id}`: Remove um usuário.

### Projetos de Extensão (`/api/projetos-extensao`)
- `GET /api/projetos-extensao?page=0&size=10&busca=inclusão`: Lista projetos paginados e pesquisa por título/descrição.
- `GET /api/projetos-extensao/{id}`: Detalhes de um projeto por ID.
- `POST /api/projetos-extensao`: Cadastra um novo projeto.
- `PUT /api/projetos-extensao/{id}`: Atualiza os dados de um projeto.
- `DELETE /api/projetos-extensao/{id}`: Remove um projeto.

Os testes de Service e Controller ficam em `backend/src/test`: eles verificam regras Java e contratos HTTP da camada MVC com dependências simuladas. Os testes de API e E2E integrados ficam em `quality/`.
