terraform {
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = ">= 4.1.0"
      }
    }
}

locals {
    app_name = "flask"
    host_domain = "example-s456g7op8.com"
    app_domain_name = "app.example-s456g7op8.com"
    api_domain_name = "api.example-s456g7op8.com"
    ssm_parameter_store_base = "/flask-nextjs-todo/prod"
}

provider "aws" {
    region = "ap-northeast-1"
    default_tags {
        tags = {
            Name = local.app_name
            application = local.app_name
        }

    }
}

