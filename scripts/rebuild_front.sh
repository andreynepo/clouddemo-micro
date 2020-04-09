#!/bin/bash
echo NAMESPACE: $NAMESPACE
echo REGION: $REGION
if [ $NAMESPACE != "" ] && [ $REGION != "" ]
then
  echo Building image...
  docker build -t $REGION.ocir.io/$NAMESPACE/clouddemo-micro/front clouddemo-front/docker/
#  echo Stopping container...
#  docker stop front
#  echo Removing container...
#  docker container rm front
#  echo Starting container...
#  docker run -dit -p 80:80 --net localnet --name front --restart=always fra.ocir.io/$NAMESPACE/clouddemo-micro/front:latest
#  docker ps
else
  echo "Usage:"
  echo "export NAMESPACE=<YOURNAMESPACE>"
  echo "export REGION=<YOURREGION>"
  echo "./rebuild_front.sh"
fi
