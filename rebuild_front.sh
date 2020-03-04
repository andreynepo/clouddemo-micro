#!/bin/bash
echo NAMESPACE: $NAMESPACE
echo BACKEND: $1
if [ "$1" != "" ] && [ $NAMESPACE != "" ]
then
  echo Building image...
  docker build --build-arg BACKEND=$1 -t fra.ocir.io/$NAMESPACE/clouddemo-micro-front clouddemo-front/docker/
#  echo Stopping container...
#  docker stop front
#  echo Removing container...
#  docker container rm front
#  echo Starting container...
#  docker run -dit -p 80:80 --net localnet --name front --restart=always fra.ocir.io/$NAMESPACE/clouddemo-micro-front:latest
#  docker ps
else
  echo "Usage:"
  echo "export NAMESPACE=<YOURNAMESPACE>"
  echo "rebuild_front <BACKEND>"
  echo "where "
  echo "<YOURNAMESPACE> is your namespace ID,"
  echo "<BACKEND> is IP address or URL of API backend."
fi
