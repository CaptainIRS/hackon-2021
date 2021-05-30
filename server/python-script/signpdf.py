import sys
import datetime
from cryptography.hazmat import backends
from cryptography.hazmat.primitives.serialization import pkcs12
from endesive.pdf import cms

import requests
import secrets
import os
randomString = sys.argv[2]
fname = 'downloadedPDFs/' + randomString + '.pdf'
#fname =  randomString +'.pdf'
if(len(sys.argv) > 1):
    fileHash = sys.argv[1]
    url = 'http://localhost:8080/ipfs/' + fileHash
    f = open(fname, 'wb')
    f.write(requests.get(url).content)
    f.close
else:
    print("supply hash as argument")


date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
date = date.strftime("D:%Y%m%d%H%M%S+00'00'")
dct = {
    "aligned": 0,
    "sigflags": 3,
    "sigflagsft": 132,
    "sigpage": 0,
    "sigbutton": True,
    "sigfield": "Signature1",
    "sigandcertify": True,
    "signaturebox": (50, 150, 250, 350),
    "signature_img": "signimg.png",
    "contact": "airs@example.com",
    "location": "India",
    "signingdate": date,
    "reason": "Formal Document",
    "password": "1234",
}

with open("./cert.p12", "rb") as fp:
    p12 = pkcs12.load_key_and_certificates(
        fp.read(), b"1234", backends.default_backend()
    )

datau = open(fname, "rb").read()
datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
fsigned = "./signedPDFs/" + randomString + '.pdf'
with open(fsigned, "wb") as fp:
    fp.write(datau)
    fp.write(datas)

os.remove(fname)
