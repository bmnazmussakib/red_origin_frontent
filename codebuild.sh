##
# You must source this file from the buildspec.yml
# for it to work properly
# Assumes you have a copy of nvm.sh in the root folder
##

NVM_DIR="$HOME/.nvm"
mkdir -p $NVM_DIR
cd $(mktemp -d) 
. $CODEBUILD_SRC_DIR/nvm.sh 
cd $CODEBUILD_SRC_DIR 
nvm install