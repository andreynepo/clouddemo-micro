#/bin/bash
echo NAMESPACE: $NAMESPACE
if [ $NAMESPACE != "" ]
then
  if [ -d clouddemo-db/docker/context/.wallet ]
  then
    echo Building image...
    docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro/db clouddemo-db/docker/
  else
    echo "Error: .wallet not found."
  fi
else
  echo "Error: NAMESPACE env variable not set."
fi
