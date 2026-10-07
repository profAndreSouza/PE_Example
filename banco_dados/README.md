# Módulo de Banco de Dados — `PE_Example`

Este diretório é responsável pela definição, manutenção e versionamento do banco de dados relacional PostgreSQL do projeto didático.

## 📁 Estrutura de Arquivos

- `compose.yaml`: Configuração Docker Compose para o container PostgreSQL 16.
- `migrations/`: Scripts DDL de criação de tabelas e índices.
- `seeds/`: Scripts DML de carga inicial de dados para desenvolvimento local e testes.

## 🚀 Como Executar Localmente

### 1. Iniciar o Banco de Dados com Docker Compose

```bash
docker compose up -d
```

O container criará o banco `pe_example` na porta `5432` com usuário `postgres` e senha `postgrespassword`, executando automaticamente os scripts SQL de inicialização.

### 2. Verificar Status do Container

```bash
docker compose ps
```

### 3. Resetar o Banco de Dados

Para limpar os dados e recriar as tabelas do zero:

```bash
docker compose down -v
docker compose up -d
```
