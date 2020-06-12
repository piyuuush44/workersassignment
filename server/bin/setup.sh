#!/bin/bash

# Terminate script if any step returns with non-zero exit code, i.e. is unsuccessful
set -e

# --------------------------------------
# Helpers

cecho(){
    RED="\033[0;31m"
    GREEN='\033[0;32m'
    LIGHT_GREEN='\033[1;92m'
    YELLOW='\033[1;33m'
    # ... ADD MORE COLORS
    NC='\033[0m' # No Color

    printf "${!1}${2} ${NC}\n"
}

print_ok() {
    cecho "GREEN" "[OK] ${1}"
}

print_error() {
    cecho "RED" "[ERROR] ${1}"
}

print_start() {
    cecho "LIGHT_GREEN" "[START] ${1}"
}

# Set up the OS name
OS="`uname`"
case $OS in
  'Linux')
  OS='Linux'
  ;;
  'FreeBSD')
  OS='FreeBSD'
  ;;
  'WindowsNT')
  OS='Windows'
  ;;
  'Darwin')
  OS='Mac'
  ;;
  'SunOS')
  OS='Solaris'
  ;;
  'AIX') ;;
  *) ;;
esac
