output "vpc_id" {
  value = module.vpc.vpc_id
}

output "rds_endpoint" {
  value     = module.rds.db_endpoint
  sensitive = false
}

output "app_runner_url" {
  value = module.app_runner.service_url
}
