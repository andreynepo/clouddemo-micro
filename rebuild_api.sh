#/bin/bash
echo Building image...
docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro-api clouddemo-api/docker/

#echo Stopping container...
#docker stop api

#echo Removing container...
#docker container rm api

#echo Starting container...
#docker run -dit --net localnet --name api --restart=always fra.ocir.io/$NAMESPACE/clouddemo-micro-api:latest

#docker ps
