# Módulo de Frontend — `PE_Example`

Aplicação web desenvolvida em **React 18**, **TypeScript** e **Vite**, consumindo a API REST do backend Spring Boot.

## 📁 Estrutura de Código

- `src/components/`: Componentes reutilizáveis de interface (`Navbar`).
- `src/pages/`: Telas da aplicação (`UsuariosPage`, `ProjetosPage`).
- `src/services/`: Cliente HTTP Axios para comunicação com os endpoints `/api/usuarios` e `/api/projetos-extensao`.
- `src/types/`: Interfaces TypeScript representando o domínio do sistema.

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+ instalado.
- Backend Spring Boot em execução em `http://localhost:8080`.

### Instalação de Dependências e Execução Dev

```bash
npm install
npm run dev
```

Acesse a interface no navegador em: `http://localhost:3000`

### Build para Produção

```bash
npm run build
```
