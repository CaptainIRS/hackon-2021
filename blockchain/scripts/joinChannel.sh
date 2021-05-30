#!/bin/bash

. scripts/setenv.sh
. scripts/utils.sh

CHANNEL_NAME=$1
NAME=$2
SUBDOMAIN=$3
DOMAIN=$4
PEER_NO=$5
PORT=$6

DELAY=3
MAX_RETRY=5

export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}
export FABRIC_CFG_PATH=./config

BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

rc=1
COUNTER=1
## Sometimes Join takes time, hence retry
while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    FABRIC_CFG_PATH=./config
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
done
cat log.txt
verifyResult $res "After $MAX_RETRY attempts, peer${PEER_NO}.${SUBDOMAIN} has failed to join channel '$CHANNEL_NAME' "