set -e
echo "current directory is `pwd`"
echo -e "\nUpdating project dependencies"
CI=true npm install
echo -e "\nRunning init scripts"
npm run pre-prod

echo "Running tests..."
./test.sh --CI

echo "build complete"
