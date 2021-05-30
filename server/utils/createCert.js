const pdf = require("pdf-creator-node");
const fs = require("fs");

const createCert = async (randomPath, user) => {
    // Read HTML Template
    var html = fs.readFileSync("templates/cert.html", "utf8");
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
    };

    var document = {
        html: html,
        data: {
            user: user,
        },
        path: randomPath,
    };

    pdf.create(document, options)
        .then((res) => {
            return res.fileName;
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = createCert;