variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "application_security_group_id" {
  type = string
}

resource "aws_db_subnet_group" "main" {
  name       = "pe-example-db-subnet-group-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "pe-example-db-subnet-group-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "pe-example-rds-sg-${var.environment}"
  description = "Acesso PostgreSQL somente pelo backend"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL do backend App Runner"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.application_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "pe-example-rds-sg-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_db_instance" "postgres" {
  identifier                 = "pe-example-db-${var.environment}"
  allocated_storage          = 20
  max_allocated_storage      = 100
  storage_type               = "gp3"
  storage_encrypted          = true
  engine                     = "postgres"
  instance_class             = "db.t4g.micro"
  db_name                    = "pe_example"
  username                   = "postgres"
  password                   = var.db_password
  db_subnet_group_name       = aws_db_subnet_group.main.name
  vpc_security_group_ids     = [aws_security_group.rds.id]
  publicly_accessible        = false
  backup_retention_period    = var.environment == "prod" ? 7 : 1
  deletion_protection        = var.environment == "prod"
  skip_final_snapshot        = var.environment != "prod"
  auto_minor_version_upgrade = true

  tags = {
    Name        = "pe-example-db-${var.environment}"
    Environment = var.environment
  }
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}

output "security_group_id" {
  value = aws_security_group.rds.id
}
