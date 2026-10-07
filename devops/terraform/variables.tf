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
  validation {
    condition     = length(var.db_password) >= 16
    error_message = "A senha do RDS deve ter pelo menos 16 caracteres."
  }
}

variable "app_image_identifier" {
  description = "Imagem Docker pública do backend, publicada em um registry acessível ao App Runner"
  type        = string
  validation {
    condition     = can(regex("^.+/.+:.+$", var.app_image_identifier))
    error_message = "Informe uma imagem Docker completa no formato registry/repository:tag."
  }
}
