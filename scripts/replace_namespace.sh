#!/bin/bash
if [ "$NAMESPACE" != "" ] && [ "$REGION" != "" ] 
then
  echo Replacing Namespace and Region value...
  find kube -type f -name "*.yaml" -exec sed -i "s/{{NAMESPACE}}/$NAMESPACE/g" {} +
  find kube -type f -name "*.yaml" -exec sed -i "s/{{REGION}}/$REGION/g" {} +
else
  echo "Namespace or Region value should be specified."
fi
