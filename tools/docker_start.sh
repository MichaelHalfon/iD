#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
  echo "USAGE: $0 ENVIRONMENT"
  echo "ENVIRONEMENT = dev, test, staging, prod"
  exit 1
fi

function get_source_dir {
  SOURCE="${BASH_SOURCE[0]}"
  while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  done
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
  echo $DIR
}

SCRIPT_DIR="$(get_source_dir)"
SOURCE_DIR="$SCRIPT_DIR/../"
DEPLOY_DIR="$SCRIPT_DIR/deployment_tools/"

declare -A environments

environments=( ["dev"]=docker-compose.dev.yml ["test"]=docker-compose.test.yml ["staging"]=docker-compose.prod.yml ["prod"]=docker-compose.prod.yml)

docker swarm init
docker stack deploy -c "$DEPLOY_DIR${environments[$1]}" routs-editor_$1

if [ "$1" == "test" ]; then
  sleep 5
  service_id=$(docker service ps -q routs-editor_$1_app)
  ret=$(docker wait routs-editor_$1_app.1.$service_id)
else
  ret=0
fi
exit $ret

#docker swarm init
#docker service create\
  #--publish published=80,target=3000,mode=host\
  #--name routs-client\
  #--limit-cpu 0.5\
  #michaelboublil/routs-client:aws

