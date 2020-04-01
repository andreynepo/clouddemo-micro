#/bin/bash
echo NAMESPACE: $NAMESPACE
if [ $NAMESPACE != "" ]
then
  echo Building image...
  docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro/api clouddemo-api/docker/
else
  echo "Error: NAMESPACE env variable not set."
fi
