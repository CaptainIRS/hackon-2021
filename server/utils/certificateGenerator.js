const util = require('util');
const exec = util.promisify(require('child_process').exec);

const generateCertificate = async (userId, email, userType) => {
  try {
    console.log({userId, email, userType});
    let privateKey = await exec('openssl ecparam -name prime256v1 -genkey -noout', {shell: '/bin/bash'});
    signingRequest = await exec(`openssl req -new -sha256 -subj "/C=IN/ST=Tamil-Nadu/L=Tiruchirappalli/O=AIRS Devs/CN=${userId}/OU=${userType}" -key <(echo "${privateKey.stdout}")`, {shell: '/bin/bash'});
    clientCert = await exec(`openssl x509 -req -in <(echo "${signingRequest.stdout}") -CA /certs/ca/ca.crt -CAkey /certs/ca/ca.key -CAcreateserial -days 1000 -sha256 2>/dev/null`, {shell: '/bin/bash'});
    clientCertBase64 = await exec(`openssl pkcs12 -export -in <(echo "${clientCert.stdout}") -inkey <(echo "${privateKey.stdout}") -password pass:1234 | base64 -w 0`, {shell: '/bin/bash'});
    console.log(clientCertBase64);
    return clientCertBase64.stdout;
  } catch (e) {
    console.log(e);
    throw "Error";
  }
}

module.exports = { generateCertificate };