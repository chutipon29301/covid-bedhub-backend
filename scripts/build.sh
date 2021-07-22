export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
sudo chown -R $USER /opt/codedeploy-agent/deployment-root/0dc0287d-1c36-4b89-b766-e4f95901c1af
yarn && yarn build