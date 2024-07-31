#!/bin/bash
set -e
EXIT_CODE=0
cd /var/app/staging
runuser -u webapp -- npm i --force --omit=dev || EXIT_CODE=$?
runuser -u webapp -- npm run build || EXIT_CODE=$?
echo $EXIT_CODE