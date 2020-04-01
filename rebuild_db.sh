#/bin/bash
echo NAMESPACE: $NAMESPACE
if [ $NAMESPACE != "" ]
then
  echo Building image...
  docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro/db clouddemo-db/docker/
else
  echo "Error: NAMESPACE env variable not set."
fi
