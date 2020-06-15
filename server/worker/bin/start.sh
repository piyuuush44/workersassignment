#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

source $PROJECT_ROOT/server/worker/bin/setup.sh

cd $PROJECT_ROOT/server/worker

print_ok "Running npm install to update dependencies"
npm install

# Set environment variables
ls
set -a
. bin/.env
set +a


print_ok "Running npm start"
npm run start_dev
