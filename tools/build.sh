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

environments=( ["dev"]=Dockerfile.dev ["test"]=Dockerfile.test ["staging"]=Dockerfile.prod ["prod"]=Dockerfile.prod)

docker build -t routs-editor:$1 -f "$DEPLOY_DIR${environments[$1]}" "$SOURCE_DIR"
