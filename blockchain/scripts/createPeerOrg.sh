#!/bin/bash

. scripts/setenv.sh
. scripts/utils.sh

name=$1
subdomain=$2
domain=$3
p0_port=$4
ca_port=$5

export FABRIC_CFG_PATH=${PWD}/configtx

function one_line_pem() {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp() {
    local PP=$(one_line_pem $3)
    local CP=$(one_line_pem $4)
    sed -e "s/\${NAME}/$name/" \
        -e "s/\${SUBDOMAIN}/$subdomain/" \
        -e "s/\${DOMAIN}/$domain/" \
        -e "s/\${P0PORT}/$1/" \
        -e "s/\${CAPORT}/$2/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp() {
    local PP=$(one_line_pem $3)
    local CP=$(one_line_pem $4)
    sed -e "s/\${NAME}/$name/" \
        -e "s/\${SUBDOMAIN}/$subdomain/" \
        -e "s/\${DOMAIN}/$domain/" \
        -e "s/\${P0PORT}/$1/" \
        -e "s/\${CAPORT}/$2/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

function createOrg() {

    local name=$1
    local subdomain=$2
    local domain=$3

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

    infoln "Creating Org Identities"

    createOrg $subdomain $domain $5

    infoln "Generating CCP files for ${name}"

    P0PORT=$4
    CAPORT=$5
    PEERPEM=organizations/peerOrganizations/${subdomain}.${domain}/tlsca/tlsca.${subdomain}.${domain}-cert.pem
    CAPEM=organizations/peerOrganizations/${subdomain}.${domain}/ca/ca.${subdomain}.${domain}-cert.pem

    echo "$(json_ccp $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/${subdomain}.${domain}/connection-${subdomain}.json
    echo "$(yaml_ccp $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/${subdomain}.${domain}/connection-${subdomain}.yaml

}

createOrg ${name} ${subdomain} ${domain} ${p0_port} ${ca_port}
