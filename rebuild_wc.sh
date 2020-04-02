#/bin/bash
echo NAMESPACE: $NAMESPACE
echo REGION: $REGION
if [ $NAMESPACE != "" ] && [ $REGION != "" ]
then
  echo Building image...
  docker build -t $REGION.ocir.io/$NAMESPACE/clouddemo-micro/wc clouddemo-wc/docker/
else
  echo "Usage:"
  echo "export NAMESPACE=<YOURNAMESPACE>"
  echo "export REGION=<YOURREGION>"
  echo "./rebuild_wc.sh"
fi
