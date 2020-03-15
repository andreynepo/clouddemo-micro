#/bin/bash
echo NAMESPACE: $NAMESPACE
if [ $NAMESPACE != "" ]
then
  echo Building image...
  docker build -t fra.ocir.io/$NAMESPACE/clouddemo-micro/wc clouddemo-wc/docker/
else
  echo "Usage:"
  echo "export NAMESPACE=<YOURNAMESPACE>"
  echo "./rebuild_wc.sh"
  echo "where <YOURNAMESPACE> is your namespace ID"
fi
