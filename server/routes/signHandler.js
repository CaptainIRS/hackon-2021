const router = require("express").Router();
const crypto = require("crypto");
const { addFileToIPFS } = require('../utils/ipfsHandlers')
const fs = require("fs");

router.get("/:fileHash", async (req, res) => {
    const { fileHash } = req.params;
    console.log(`File Hash recieved is: ${fileHash}`);

    const randomName = crypto.randomBytes(10).toString("hex");
    const randomPath = "signedPDFs/" + randomName + ".pdf";

    var spawn = require("child_process").spawn;
    var python = spawn("python3", [
        "./python-script/signpdf.py",
        fileHash,
        randomName,
    ]);

    python.stdout.on("data", function (data) {
        dataToSend = data.toString();
        console.log(dataToSend);
    });
    python.on("error", function (err) {
        console.log("ERROR")
        console.log(err);
    });

    //Waiting to Generate File
    await new Promise((r) => setTimeout(r, 3000));

    const hash = await addFileToIPFS(randomPath);
    console.log(hash);
    fs.unlinkSync(randomPath);
    // const obj = {
    // 	"function":"addFile","Args":[`${fileHash}`,`${hash}`]
    // }

    // exec(`../"shell scripts"/addFile.sh '${JSON.stringify(obj)}'`,
    //     (error, stdout, stderr) => {
    //         console.log(stdout);
    //         console.log(stderr);
    //         if (error !== null) {
    //             console.log(`exec error: ${error}`);
    //         }
    // 	});

    // const obj = {
    // 	"function":"addFile","Args":[`${hash}`]
    // }

    // exec(`../"shell scripts"/addFile.sh '${JSON.stringify(obj)}'`,
    // 	(error, stdout, stderr) => {
    // 		console.log(stdout);
    // 		console.log(stderr);
    // 		if (error !== null) {
    // 			console.log(`exec error: ${error}`);
    // 		}
    // 	});

    // args = [fileHash, hash];
    // var output = await query.query(
    //     "documentchannel",
    //     "records",
    //     args,
    //     "changeFile",
    //     username,
    //     "Administration"
    // );

    // args = [hash];
    // output = await query.query(
    //     "documentchannel",
    //     "records",
    //     args,
    //     "returnFile",
    //     username,
    //     "Administration"
    // );
    res.json({ hash });
    // res.send("OK")
});
//QmeQgVkVPv3bGRFD3KLudAv6C5p2yxF7gNSRiKFpPn1GTw // Test hash

module.exports = router;