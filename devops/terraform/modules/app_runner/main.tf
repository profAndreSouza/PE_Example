variable "environment" { type = string }
variable "image_identifier" {
  type    = string
  default = "public.ecr.aws/docker/library/hello-world:latest"
}

resource "aws_apprunner_service" "backend" {
  service_name = "pe-example-backend-${var.environment}"

  source_configuration {
    image_repository {
      image_identifier      = var.image_identifier
      image_repository_type = "ECR_PUBLIC"
    }
    auto_deployments_enabled = false
  }

  tags = {
    Name        = "pe-example-backend-${var.environment}"
    Environment = var.environment
  }
}

output "service_url" {
  value = aws_apprunner_service.backend.service_url
}
