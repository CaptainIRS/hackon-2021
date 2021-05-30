#!/bin/bash

CHANNEL_NAME=$1
NAME=$2
SUBDOMAIN=$3
DOMAIN=$4
PEER_NO=$5
PORT=$6

docker exec cli ./scripts/setAnchor.sh $CHANNEL_NAME ${NAME} ${SUBDOMAIN} ${DOMAIN} ${PEER_NO} ${PORT}
