#!/bin/bash

source scripts/utils.sh

function createOrg() {
  SUBDOMAIN=$1
  DOMAIN=$2
  PORT=$3

  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${PORT} --caname ca-${SUBDOMAIN} --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-'${PORT}'-ca-'${SUBDOMAIN}'.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-'${PORT}'-ca-'${SUBDOMAIN}'.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-'${PORT}'-ca-'${SUBDOMAIN}'.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-'${PORT}'-ca-'${SUBDOMAIN}'.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-${SUBDOMAIN} --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-${SUBDOMAIN} --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-${SUBDOMAIN} --id.name ${SUBDOMAIN}admin --id.secret ${SUBDOMAIN}adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers
  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${PORT} --caname ca-${SUBDOMAIN} -M ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/msp --csr.hosts peer0.${SUBDOMAIN}.${DOMAIN} --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/config.yaml ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${PORT} --caname ca-${SUBDOMAIN} -M ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls --enrollment.profile tls --csr.hosts peer0.${SUBDOMAIN}.${DOMAIN} --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/signcerts/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/keystore/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/tlsca
  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/tlsca/tlsca.${SUBDOMAIN}.${DOMAIN}-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/ca
  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/peers/peer0.${SUBDOMAIN}.${DOMAIN}/msp/cacerts/* ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/ca/ca.${SUBDOMAIN}.${DOMAIN}-cert.pem

  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users
  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/User1@${SUBDOMAIN}.${DOMAIN}

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:${PORT} --caname ca-${SUBDOMAIN} -M ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/User1@${SUBDOMAIN}.${DOMAIN}/msp --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/config.yaml ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/User1@${SUBDOMAIN}.${DOMAIN}/msp/config.yaml

  mkdir -p organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/Admin@${SUBDOMAIN}.${DOMAIN}

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://${SUBDOMAIN}admin:${SUBDOMAIN}adminpw@localhost:${PORT} --caname ca-${SUBDOMAIN} -M ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/Admin@${SUBDOMAIN}.${DOMAIN}/msp --tls.certfiles ${PWD}/organizations/fabric-ca/${SUBDOMAIN}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/msp/config.yaml ${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/Admin@${SUBDOMAIN}.${DOMAIN}/msp/config.yaml
}

function createOrderer() {
  DOMAIN=$1
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/${DOMAIN}

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/${DOMAIN}
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/${DOMAIN}/msp/config.yaml

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/${DOMAIN}/orderers
  mkdir -p organizations/ordererOrganizations/${DOMAIN}/orderers/${DOMAIN}

  mkdir -p organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp --csr.hosts orderer.${DOMAIN} --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/msp/config.yaml ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/config.yaml

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls --enrollment.profile tls --csr.hosts orderer.${DOMAIN} --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/keystore/* ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/${DOMAIN}/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem

  mkdir -p organizations/ordererOrganizations/${DOMAIN}/users
  mkdir -p organizations/ordererOrganizations/${DOMAIN}/users/Admin@${DOMAIN}

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/${DOMAIN}/users/Admin@${DOMAIN}/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/${DOMAIN}/msp/config.yaml ${PWD}/organizations/ordererOrganizations/${DOMAIN}/users/Admin@${DOMAIN}/msp/config.yaml
}
