output "vpc_id" {
  description = "ID of the DevOps project VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the DevOps project VPC"
  value       = module.vpc.vpc_cidr
}
