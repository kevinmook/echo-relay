#!/bin/bash -e

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

container_name=$1

if [ -z "$container_name" ]; then
  echo "Usage: $progname <container_name>"
  exit 1
fi

. "$DIR/start_docker"

container_id=$($DIR/find_container_id $container_name)
docker exec -it $container_id /bin/bash -l
