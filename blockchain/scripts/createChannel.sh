#!/bin/bash

# imports  
. scripts/setenv.sh
. scripts/utils.sh

CHANNEL_NAME=$1
NAME=$2
SUBDOMAIN=$3
DOMAIN=$4
PEER_NO=$5
PORT=$6
PROFILE=$7

DELAY=5
MAX_RETRY=2

export FABRIC_CFG_PATH=${PWD}/configtx

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}

createChannelTx() {
	set -x
	configtxgen -profile ${PROFILE} -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  	verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	# setGlobals 1
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep 3
		set -x
		peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.airs.dev -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock $BLOCKFILE --tls --cafile $ORDERER_CA >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channeltx
infoln "Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx

FABRIC_CFG_PATH=$PWD/config
BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel
successln "Channel '$CHANNEL_NAME' created"