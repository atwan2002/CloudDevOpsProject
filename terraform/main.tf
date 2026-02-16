provider "aws" {
  region = "us-west-1"
}

module "network" {
  source = "./modules/network"
}

module "server" {
  source     = "./modules/server"
  vpc_id     = module.network.vpc_id
  subnet_id  = module.network.public_subnet_id
}

