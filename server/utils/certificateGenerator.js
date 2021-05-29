const util = require('util');
const exec = util.promisify(require('child_process').exec);

const generateCertificate = async (userId, userType) => {
  try {
    console.log({userId, userType});
    let result = await exec('openssl ecparam -name prime256v1 -genkey -noout', {shell: '/bin/bash'});
    result = await exec(`openssl req -new -sha256 -subj "/C=IN/ST=Tamil-Nadu/L=Tiruchirappalli/O=AIRS Devs/CN=${userId}/OU=${userType}" -key <(echo "${result.stdout}")`, {shell: '/bin/bash'});
    result = await exec(`openssl x509 -req -in <(echo "${result.stdout}") -CA /certs/ca/ca.crt -CAkey /certs/ca/ca.key -CAcreateserial -days 1000 -sha256 2>/dev/null`, {shell: '/bin/bash'});
    return result.stdout;
  } catch (e) {
    console.log(e);
    throw "Error";
  }
}

module.exports = { generateCertificate };