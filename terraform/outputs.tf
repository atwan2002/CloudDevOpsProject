output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_id" {
  value = module.network.public_subnet_id
}

output "instance_public_ip" {
  value = module.server.instance_public_ip
}

