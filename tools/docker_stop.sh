#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "USAGE: $0 ENVIRONMENT"
  echo "ENVIRONEMENT = dev, test, staging, prod"
  exit 1
fi

#declare -A environments

#dockerfile_dir="scripts/deployment_tools/"

#environments=( ["dev"]=docker-compose.dev.yml ["test"]=docker-compose.test.yml ["staging"]=docker-compose.prod.yml ["prod"]=docker-compose.prod.yml)

docker stack rm routs-editor_$1
docker swarm leave --force

#docker service rm routs-client
#docker swarm leave --force
