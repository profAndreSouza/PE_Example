variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "db_password" { type = string }
variable "environment" { type = string }

resource "aws_db_subnet_group" "main" {
  name       = "pe-example-db-subnet-group-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "pe-example-db-subnet-group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "pe-example-rds-sg-${var.environment}"
  description = "Permite acesso ao PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "pe-example-db-${var.environment}"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t4g.micro"
  db_name                = "pe_example"
  username               = "postgres"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
