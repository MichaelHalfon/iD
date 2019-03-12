#!/bin/bash

UUID=$(echo $TRAVIS_COMMIT | fold -w 7 | head -n 1)

echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

if [[ $TRAVIS_BRANCH = "master" ]]; then
  ./tools/build.sh prod
  docker tag routs-api:prod michaelboublil/routs-editor:prod
  docker push michaelboublil/routs-editor:prod
elif [[ $TRAVIS_BRANCH = "dev" ]]; then
  ./tools/build.sh staging
  docker tag routs-api:staging michaelboublil/routs-editor:staging-$UUID
  docker push michaelboublil/routs-editor:staging-$UUID
fi

