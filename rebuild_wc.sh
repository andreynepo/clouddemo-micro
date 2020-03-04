#/bin/bash
echo Building image...
docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro-wc clouddemo-wc/docker/

#echo Stopping container...
#docker stop wc

#echo Removing container...
#docker container rm wc

#echo Starting container...
#docker run -dit --net localnet --name wc --restart=always fra.ocir.io/$NAMESPACE/clouddemo-micro-wc:latest

#docker ps
