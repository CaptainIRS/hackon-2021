#!/bin/bash

. scripts/setenv.sh
. scripts/utils.sh

export FABRIC_CFG_PATH=${PWD}/configtx

domain=$1

function createOrderer() {

    local domain=$1

    infoln "Generating certificates using Fabric CA"

    COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

    IMAGE_TAG=${CA_IMAGETAG} docker-compose -f $COMPOSE_FILE_CA up -d 2>&1

    . organizations/fabric-ca/registerEnroll.sh

    while :
    do
      if [ ! -f "organizations/fabric-ca/professors/tls-cert.pem" ]; then
        sleep 1
      else
        break
      fi
    done

    infoln "Creating Professors Identities"

    createOrderer $domain
}

createOrderer ${domain}
