#!/bin/bash

. scripts/utils.sh
. scripts/setenv.sh

CHANNEL_NAME=$1
NAME=$2
SUBDOMAIN=$3
DOMAIN=$4
PEER_NO=$5
PORT=$6
CC_NAME=${7}
CC_VERSION=${10:-"1.0"}
CC_SEQUENCE=${11:-"1"}
CC_INIT_FCN=${12:-"NA"}
CC_END_POLICY=${13:-"NA"}
CC_COLL_CONFIG=${14:-"NA"}
DELAY=${15:-"3"}
MAX_RETRY=${16:-"5"}
VERBOSE=${17:-"false"}

export FABRIC_CFG_PATH=./config
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  shift 1
  infoln "Checking the commit readiness of the chaincode definition on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    infoln "Attempting to check the commit readiness of the chaincode definition on peer${PEER_NO}.${SUBDOMAIN}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} --output json >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=0
    for var in "$@"; do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    infoln "Checking the commit readiness of the chaincode definition successful on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Check commit readiness result on peer${PEER_NO}.${SUBDOMAIN} is INVALID!"
  fi
}

checkCommitReadiness