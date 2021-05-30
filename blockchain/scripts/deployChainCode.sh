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

println "executing with the following"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- CC_END_POLICY: ${C_GREEN}${CC_END_POLICY}${C_RESET}"
println "- CC_COLL_CONFIG: ${C_GREEN}${CC_COLL_CONFIG}${C_RESET}"
println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"

export FABRIC_CFG_PATH=./config
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

setGlobals ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}

## Make sure that the path to the chaincode exists
if [ ! -d "$CC_SRC_PATH" ]; then
  fatalln "Path to chaincode does not exist. Please provide different path."
fi

CC_SRC_LANGUAGE=javascript

CC_RUNTIME_LANGUAGE=node

INIT_REQUIRED="--init-required"
# check if the init fcn should be called
if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=""
fi

if [ "$CC_END_POLICY" = "NA" ]; then
  CC_END_POLICY=""
else
  CC_END_POLICY="--signature-policy $CC_END_POLICY"
fi

if [ "$CC_COLL_CONFIG" = "NA" ]; then
  CC_COLL_CONFIG=""
else
  CC_COLL_CONFIG="--collections-config $CC_COLL_CONFIG"
fi

packageChaincode() {
  FABRIC_CFG_PATH=$PWD/config/
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

# installChaincode PEER ORG
installChaincode() {
  FABRIC_CFG_PATH=$PWD/config/
  set -x
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode installation on peer${PEER_NO}.${SUBDOMAIN} has failed"
  successln "Chaincode is installed on peer${PEER_NO}.${SUBDOMAIN}"
}

# queryInstalled PEER ORG
queryInstalled() {
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer${PEER_NO}.${SUBDOMAIN} has failed"
  successln "Chaincode installed successful on peer${PEER_NO}.${SUBDOMAIN} on channel ${CHANNEL_NAME}"
}

## package the chaincode
packageChaincode

## Install chaincode on peer${PEER_NO}.professors and peer${PEER_NO}.students
infoln "Installing chaincode on peer${PEER_NO}.${SUBDOMAIN}..."
installChaincode

## query whether the chaincode is installed
queryInstalled