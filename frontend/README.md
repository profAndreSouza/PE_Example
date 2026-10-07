# Módulo de Frontend — `PE_Example`

Aplicação web desenvolvida em **React 18**, **TypeScript** e **Vite**, consumindo a API REST do backend Spring Boot.

## 📁 Estrutura de Código

- `src/components/`: Componentes reutilizáveis de interface (`Navbar`).
- `src/pages/`: Telas da aplicação (`UsuariosPage`, `ProjetosPage`).
- `src/services/`: Cliente HTTP Axios para comunicação com os endpoints `/api/usuarios` e `/api/projetos-extensao`.
- `src/types/`: Interfaces TypeScript representando o domínio do sistema.

As páginas oferecem busca no servidor e paginação. Os componentes compartilhados incluem tabela, modal de formulário, alertas e controles de paginação.

## 🚀 Como Executar

### Executar com Docker

Na raiz do repositório, execute:

```bash
docker compose up --build
```

Acesse `http://localhost:3000`. O Nginx serve a aplicação e encaminha as chamadas `/api` para o backend pela rede do Docker.

### Pré-requisitos
- Node.js 20+ instalado.
- Backend Spring Boot em execução em `http://localhost:8080`.

### Instalação de Dependências e Execução Dev

```bash
npm install
npm run dev
```

Acesse a interface no navegador em: `http://localhost:3000`

No modo Vite, as chamadas `/api` são encaminhadas para `http://localhost:8080`.

### Build para Produção

```bash
npm run build
```

### Verificações de qualidade

```bash
npm run lint
npm run build
```
