#!/usr/bin/env bash

#-------
# Setup
#-------
rm -f test-result.json
rm -f test-result-meta.json

#-----------
# Run tests
#-----------
if [[ "$*" == *'--remote'* || "x${1}" == "x" ]]; then
    echo "Running test remotely"
    NODE_PATH="$(pwd)/node_modules"
    node node_modules/intern/bin/intern-runner\
    config=intern\
    reporters=Runner\
    reporters="$(pwd)"/support/JSON\
    functionalSuites="functional/index"\
    base_url=http://www.nutritionix.com
fi
# END

#----------
# Teardown
#----------
# rm -f test-result.json
# rm -f test-result-meta.json
