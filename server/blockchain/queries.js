"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("./CAUtil.js");
const { buildCCPProfessors, buildWallet } = require("./AppUtil.js");

const channelName = "documentchannel";
const chaincodeName = "course-certificates";
const mspProfessors = "ProfessorsMSP";
const walletPath = path.join(__dirname, "wallet");
const professorsUserId = "admin";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function submitTransaction(transaction, args) {
  try {
    const ccp = buildCCPProfessors();
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.professors.airs.dev"
    );
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspProfessors);
    await registerAndEnrollUser(
      caClient,
      wallet,
      mspProfessors,
      professorsUserId
    );

    const gateway = new Gateway();
    let result = null;
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: professorsUserId,
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      console.log("\n--> Submit Transaction:");
      result = await contract.submitTransaction(transaction, ...args);
      console.log("*** Result: committed");
      if (result) {
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      }
    } finally {
      gateway.disconnect();
    }
    return result;
  } catch (error) {
    console.error(`*** FAILED to run the application: ${error}`);
  }
}

async function evaluateTransaction(transaction, args) {
  try {
    const ccp = buildCCPProfessors();
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.professors.airs.dev"
    );
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspProfessors);
    await registerAndEnrollUser(
      caClient,
      wallet,
      mspProfessors,
      professorsUserId
    );

    const gateway = new Gateway();
    let result = null;
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: professorsUserId,
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      console.log("\n--> Evaluate Transaction:");
      let result = await contract.evaluateTransaction(transaction, ...args);
      console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    } finally {
      gateway.disconnect();
    }
    return result;
  } catch (error) {
    console.error(`*** FAILED to run the application: ${error}`);
  }
}

const createCourseCertificateRecord = async (
  courseCertificateRecordId,
  studentId,
  ipfsHash,
  verified
) => {
  return await submitTransaction("createCourseCertificateRecord", [
    courseCertificateRecordId,
    studentId,
    ipfsHash,
    verified,
  ]);
};

const readCourseCertificateRecord = async (certificateId) => {
  return await evaluateTransaction("readCourseCertificateRecord", [
    certificateId,
  ]);
};

const courseCertificateRecordExists = async (certificateId) => {
  return await evaluateTransaction("courseCertificateRecordExists", [
    certificateId,
  ]);
};

const updateCourseCertificateRecord = async (
  certificateId,
  studentId,
  ipfsHash,
  verified
) => {
  return await submitTransaction("updateCourseCertificateRecord", [
    certificateId,
    studentId,
    ipfsHash,
    verified,
  ]);
};

const queryAllVerifiedCourseCertificateRecords = async () => {
  return await evaluateTransaction(
    "queryAllVerifiedCourseCertificateRecords",
    []
  );
};

const queryAllNotVerifiedCourseCertificateRecords = async () => {
  return await evaluateTransaction(
    "queryAllNotVerifiedCourseCertificateRecords",
    []
  );
};

module.exports = {
  createCourseCertificateRecord,
  readCourseCertificateRecord,
  courseCertificateRecordExists,
  updateCourseCertificateRecord,
  queryAllVerifiedCourseCertificateRecords,
  queryAllNotVerifiedCourseCertificateRecords,
};
