const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({ port: 5002 });

const addFileToIPFS = async (path) => {
  const file = await ipfs.add(ipfsClient.globSource(path));
  console.log(`Added File ${path} to ${file.cid.toString()}`);
  return file.cid.toString();
};
module.exports = { addFileToIPFS };
