#!/bin/bash

. scripts/setenv.sh
. scripts/utils.sh

# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=docker/docker-compose-test-net.yaml
# docker-compose.yaml file if you are using couchdb
COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml
# certificate authorities compose file
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

# stop org3 containers also in addition to professors and students, in case we were running sample to add org3
IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans
# Don't remove the generated artifacts -- note, the ledgers are always removed

# Bring down the network, deleting the volumes
# remove orderer block and other channel configuration transactions and certs
rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations
## remove fabric ca artifacts
rm -rf organizations/fabric-ca/professors/msp organizations/fabric-ca/professors/tls-cert.pem organizations/fabric-ca/professors/ca-cert.pem organizations/fabric-ca/professors/IssuerPublicKey organizations/fabric-ca/professors/IssuerRevocationPublicKey organizations/fabric-ca/professors/fabric-ca-server.db
rm -rf organizations/fabric-ca/students/msp organizations/fabric-ca/students/tls-cert.pem organizations/fabric-ca/students/ca-cert.pem organizations/fabric-ca/students/IssuerPublicKey organizations/fabric-ca/students/IssuerRevocationPublicKey organizations/fabric-ca/students/fabric-ca-server.db
rm -rf organizations/fabric-ca/ordererOrg/msp organizations/fabric-ca/ordererOrg/tls-cert.pem organizations/fabric-ca/ordererOrg/ca-cert.pem organizations/fabric-ca/ordererOrg/IssuerPublicKey organizations/fabric-ca/ordererOrg/IssuerRevocationPublicKey organizations/fabric-ca/ordererOrg/fabric-ca-server.db
# remove channel and script artifacts
rm -rf channel-artifacts log.txt *.tar.gz
