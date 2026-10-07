variable "aws_region" {
  description = "Região da AWS para deploy dos recursos"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nome do ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "db_password" {
  description = "Senha de administrador do banco de dados RDS"
  type        = string
  sensitive   = true
  default     = "PEExampleStrongPassword123!"
}
