# Módulo de DevOps & Infraestrutura — `PE_Example`

Este diretório contém os artefatos de **Infraestrutura como Código (IaC)** em **Terraform** para provisionamento de recursos na AWS, além das pipelines automatizadas de **CI/CD** em **GitHub Actions**.

## 📁 Estrutura de Conteúdos

- `terraform/`: Código declarativo Terraform.
  - `modules/vpc`: Rede, Subnets e Security Groups.
  - `modules/rds`: Instância do PostgreSQL na AWS.
  - `modules/app_runner`: Hospedagem serverless de containers.
- `.github/workflows/`: Pipelines de integração e entrega contínua:
  - `backend-ci.yml`: Build Maven, compilação Java 21 e execução de suítes de testes unitários.
  - `frontend-ci.yml`: Validação TypeScript, linting e build React Vite.
  - `infra-ci.yml`: Validação e verificação de formatação dos arquivos Terraform.

## 🚀 Como Executar o Terraform Localmente

### Pré-requisitos
- Terraform CLI 1.5+ instalado.
- Credenciais da AWS configuradas (`aws configure`).

### Comandos Principais

```bash
cd devops/terraform

# Inicializar o repositório Terraform
terraform init

# Verificar se a formatação dos arquivos segue o padrão
terraform fmt -check -recursive

# Validar sintaxe dos módulos
terraform validate

# Planejar as alterações na infraestrutura AWS
terraform plan
```
