sudo chown ec2-user:ec2-user -R /opt/codedeploy-agent/
sudo chown ec2-user:ec2-user -R /var/log/aws/
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
yarn && yarn build