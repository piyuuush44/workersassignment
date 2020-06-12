#!/bin/bash

# Terminate script if any step returns with non-zero exit code, i.e. is unsuccessful
set -e

source ./bin/setup.sh

date

print_ok "Stating the server"
./node_modules/.bin/nodemon ./bin/www
