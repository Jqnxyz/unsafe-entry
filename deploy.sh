#!/bin/zsh
serviceName="unsafe-entry"
repoName="unsafe-entry"

echo "---Start Deploy---\n"
echo "Commit Message:"
read CommitMsg
echo "\nCommit with message: $CommitMsg\nand deploying to: "
cat deploy-config.json | jq '.["target-hosts"][]'
echo "\n\nConfirm? y/n [y]:"
read ConfirmDeploy

if [[ "${ConfirmDeploy}" == "y" ]] || [[ "${ConfirmDeploy}" == "Y" ]]; then
	git add *;
	git commit -S -m $CommitMsg
	git push origin master
	echo "!!!------!!!\nRunning Remote Commands\n!!!------!!!\n"
	cat deploy-config.json | jq '.["target-hosts"][]' | xargs -n1 ssh -o RemoteCommand="sudo systemctl stop ${serviceName}.service; cd /var/www-node/${repoName}/; git pull origin master; npm install; sudo systemctl start ${serviceName}.service" 
	echo "---\nCompleted Deploy\n---\n"
	return 0
else
    printf "Answer received was not 'y', assuming 'n'.\n"
    return 1
fi