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
CC_INIT_FCN=${8:-"NA"}
CC_SRC_PATH=${9}
CC_VERSION=${10:-"1.0"}
CC_SEQUENCE=${11:-"1"}
CC_END_POLICY=${13:-"NA"}
CC_COLL_CONFIG=${14:-"NA"}
DELAY=${15:-"3"}
MAX_RETRY=${16:-"5"}
VERBOSE=${17:-"false"}

export FABRIC_CFG_PATH=./config
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}

if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=false
else
  INIT_REQUIRED=true
fi

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.${DOMAIN} --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
  --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/professors.airs.dev/peers/peer0.professors.airs.dev/tls/ca.crt \
    --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/students.airs.dev/peers/peer0.students.airs.dev/tls/ca.crt \
     --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer${PEER_NO}.${SUBDOMAIN} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition committed on channel '$CHANNEL_NAME'"
}

commitChaincodeDefinition