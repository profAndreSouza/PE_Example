terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
}

resource "aws_security_group" "backend" {
  name        = "pe-example-backend-sg-${var.environment}"
  description = "Security group for App Runner VPC egress"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "pe-example-backend-sg-${var.environment}"
    Environment = var.environment
  }
}

module "rds" {
  source                        = "./modules/rds"
  environment                   = var.environment
  vpc_id                        = module.vpc.vpc_id
  subnet_ids                    = module.vpc.private_subnet_ids
  db_password                   = var.db_password
  application_security_group_id = aws_security_group.backend.id
}

module "app_runner" {
  source                        = "./modules/app_runner"
  environment                   = var.environment
  image_identifier              = var.app_image_identifier
  subnet_ids                    = module.vpc.private_subnet_ids
  application_security_group_id = aws_security_group.backend.id
  db_endpoint                   = module.rds.db_endpoint
  db_password                   = var.db_password
}
