const router = require("express").Router();
const createCert = require("../utils/createCert");
// const { sendEmail } = require("../helpers/sendEmail");
const crypto = require("crypto");
const { addFileToIPFS } = require("../utils/ipfsHandlers");
// const query = require("../app/query")
const fs = require("fs");
const { createCourseCertificateRecord } = require("../blockchain/queries");

router.post("/", async (req, res) => {
  const { rollno, year, course, dept, purpose, name } = req.body;
  const dateNow = new Date();
  const date =
    dateNow.getDate().toString() +
    "/" +
    (dateNow.getMonth() + 1).toString() +
    "/" +
    dateNow.getFullYear().toString();
  const randomName = crypto.randomBytes(10).toString("hex");
  const randomPath = "generatedPDFs/" + randomName + ".pdf";
  await createCert(randomPath, {
    name: name.toUpperCase(),
    rollno,
    year,
    course,
    dept,
    purpose,
    date,
  });
  console.log(`New PDF Generated: ${randomName} ${randomPath}`);
  //Waiting to Generate File
  await new Promise((r) => setTimeout(r, 3000));
  const hash = await addFileToIPFS(randomPath);

  if (req.headers["x-user"]) {
    let studentId = req.headers["x-user"].match(/CN=(.*?),/)[1];
    createCourseCertificateRecord(randomName, studentId, hash, false);
  } else {
    throw "Invalid User";
  }

  fs.unlink(randomPath, (err) => {
    if (err) console.log("Error Deleting File", err);
  });
  console.log(`Hash after cert gen: ${hash}`);
  res.json({ hash });
});

module.exports = router;
