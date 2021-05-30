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
PACKAGE_ID=${8}
CC_SRC_PATH=${9}
CC_VERSION=${10:-"1.0"}
CC_SEQUENCE=${11:-"1"}
CC_INIT_FCN=${12:-""}
CC_END_POLICY=${13:-""}
CC_COLL_CONFIG=${14:-""}
DELAY=${15:-"3"}
MAX_RETRY=${16:-"5"}
VERBOSE=${17:-"false"}


export FABRIC_CFG_PATH=./config
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  set -x
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.${DOMAIN} --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition approved on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME'"
}

approveForMyOrg