#!/bin/bash

if [ -d "organizations/peerOrganizations" ]; then
    echo "Cleaning up previous Org files" 
    rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
fi