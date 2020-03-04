if [ "$1" != "" ]
then
  echo Replacing Namespace value...
  find kube -type f -name "*.yaml" -exec sed -i "s/{{NAMESPACE}}/$1/g" {} +
else
  echo "Namespace value should be specified."
fi
