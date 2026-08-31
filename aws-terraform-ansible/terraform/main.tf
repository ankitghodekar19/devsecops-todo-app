module "vpc" {
  source = "../modules/vpc"

  vpc_cidr = "10.0.0.0/16"
  vpc_name = "devops-project-vpc"
}

module "eks" {
  source = "../modules/eks"

  cluster_name = "devsecops-cluster"
  environment  = "dev"

  subnet_ids = module.vpc.private_subnet_ids
}