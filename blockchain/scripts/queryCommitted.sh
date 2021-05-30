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
CC_SRC_PATH=${8}
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

# queryCommitted ORG
queryCommitted() {
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  infoln "Querying chaincode definition on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1

  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    infoln "Attempting to Query committed status on peer${PEER_NO}.${SUBDOMAIN}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    successln "Query chaincode definition successful on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query chaincode definition result on peer${PEER_NO}.${SUBDOMAIN} is INVALID!"
  fi
}

queryCommitted