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
- Uma imagem do backend publicada como imagem pública compatível com o App Runner.
- Senha de RDS fornecida por variável de ambiente ou arquivo de variáveis local não versionado.

### Comandos Principais

```bash
cd devops/terraform

# Inicializar o repositório Terraform
terraform init

# Verificar se a formatação dos arquivos segue o padrão
terraform fmt -check -recursive

# Validar sintaxe dos módulos
terraform validate

# Planejar com variáveis fornecidas sem gravar segredos no repositório
$env:TF_VAR_db_password = "<senha-com-pelo-menos-16-caracteres>"
$env:TF_VAR_app_image_identifier = "public.ecr.aws/<alias>/<repositorio>:<tag>"
terraform plan
```

O módulo cria sub-redes privadas para RDS e App Runner, restringe a porta 5432 ao security group do backend e injeta a senha do banco via AWS Secrets Manager. Use backend remoto de estado criptografado e IAM de menor privilégio fora de exercícios locais; o estado do Terraform ainda pode conter valores sensíveis.

Os recursos AWS podem gerar custos. O `docker compose up --build` da raiz é o caminho recomendado para executar o projeto didático localmente sem provisionar nuvem.
