#!/bin/zsh
#This Source Code Form is subject to the terms of the Mozilla Public
#License, v. 2.0. If a copy of the MPL was not distributed with this
#file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
