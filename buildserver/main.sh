#!/bin/bash

set -a
source .env
set +a

mkdir -p /home/app/output

node script.js

if [ $? -eq 0 ]; then
    echo "Deployment completed successfully"
    exit 0
else
    echo "Deployment failed"
    exit 1
fi