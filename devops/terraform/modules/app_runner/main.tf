variable "environment" {
  type = string
}

variable "image_identifier" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "application_security_group_id" {
  type = string
}

variable "db_endpoint" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_secretsmanager_secret" "database_password" {
  name = "pe-example/database-password-${var.environment}"
}

resource "aws_secretsmanager_secret_version" "database_password" {
  secret_id     = aws_secretsmanager_secret.database_password.id
  secret_string = var.db_password
}

resource "aws_iam_role" "instance" {
  name = "pe-example-apprunner-instance-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "tasks.apprunner.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "read_database_password" {
  name = "read-database-password"
  role = aws_iam_role.instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = aws_secretsmanager_secret.database_password.arn
    }]
  })
}

resource "aws_apprunner_vpc_connector" "backend" {
  vpc_connector_name = "pe-example-backend-${var.environment}"
  subnets            = var.subnet_ids
  security_groups    = [var.application_security_group_id]

  tags = {
    Name        = "pe-example-backend-vpc-connector-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_apprunner_service" "backend" {
  service_name = "pe-example-backend-${var.environment}"

  source_configuration {
    image_repository {
      image_identifier      = var.image_identifier
      image_repository_type = "ECR_PUBLIC"

      image_configuration {
        port = "8080"
        runtime_environment_variables = {
          SPRING_DATASOURCE_URL      = "jdbc:postgresql://${var.db_endpoint}:5432/pe_example"
          SPRING_DATASOURCE_USERNAME = "postgres"
        }
        runtime_environment_secrets = {
          SPRING_DATASOURCE_PASSWORD = aws_secretsmanager_secret.database_password.arn
        }
      }
    }
    auto_deployments_enabled = false
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.backend.arn
    }
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  health_check_configuration {
    protocol = "TCP"
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.instance.arn
  }

  tags = {
    Name        = "pe-example-backend-${var.environment}"
    Environment = var.environment
  }
}

output "service_url" {
  value = aws_apprunner_service.backend.service_url
}
