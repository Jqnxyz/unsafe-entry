#!/bin/zsh
DoAction=$1
if [[ "${DoAction}" == "start" ]]; then
	echo "!!!---!!!\nStarting Instances\n-!!!--!!!\n"
    cat deploy-config.json | jq '.["instance-ids"][]' | xargs -n1 aws ec2 start-instances --instance-ids | jq '.StartingInstances[0].CurrentState.Name'
	echo "---\nStart Commands Issued\n---"
	return 0
elif [[ "${DoAction}" == "stop" ]]; then
	echo "!!!---!!!\nStopping Instances\n-!!!--!!!\n"
    cat deploy-config.json | jq '.["instance-ids"][]' | xargs -n1 aws ec2 stop-instances --instance-ids | jq '.StoppingInstances[0].CurrentState.Name'
	echo "---\nStop Commands Issued\n---\n"
	return 0
else
	printf "USAGE: instaces.sh <start/stop>\n"
    printf "No action given, provide either 'start' or 'stop'\n"
    return 1
fi
