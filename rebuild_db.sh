#/bin/bash
echo Building image...
docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro-db ~/clouddemo-micro/clouddemo-db/docker/

#echo Stopping container...
#docker stop db

#echo Removing container...
#docker container rm db

#echo Starting container...
#docker run -dit --net localnet --name db --restart=always fra.ocir.io/$NAMESPACE/clouddemo-micro-db:latest

#docker ps
