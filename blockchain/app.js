const { execSync } = require('child_process');
const express = require("express");
const app = new express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const execScript = (script, args = "") => {
    console.log(`scripts/${script}.sh ${args}`);
    try {
        let result = execSync(`scripts/${script}.sh ${args}`, {
            shell: '/bin/sh'
        });
        console.log(result.toString());
        return (result.toString());
    } catch (e) {
        console.log(e.toString())
        return (e.stdout.toString() + e.toString());
    }
}


app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/node_modules/xterm/css/xterm.css', async (req, res) => {
    res.sendFile(__dirname + '/node_modules/xterm/css/xterm.css');
})

app.get('/node_modules/xterm/lib/xterm.js', async (req, res) => {
    res.sendFile(__dirname + '/node_modules/xterm/lib/xterm.js');
})

const args = {
    setenv: [],
    cleanup: [],
    checkPrereqs: [],
    cleanupOrgs: [],
    createPeerOrg_Professors: ['Professors', 'professors', 'airs.dev', 7051, 7054],
    createPeerOrg_Students: ['Students', 'students', 'airs.dev', 9051, 8054],
    createOrdererOrg: ['airs.dev'],
    createConsortium: ['TwoOrgsOrdererGenesis'],
    networkUp: [],
    createChannel: ['documentchannel', 'Professors', 'professors', 'airs.dev', 0, 7051, "TwoOrgsChannel"],
    joinChannel_Professors: ['documentchannel', 'Professors', 'professors', 'airs.dev', 0, 7051],
    joinChannel_Students: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051],
    setAnchorPeer_Professors: ['documentchannel', 'Professors', 'professors', 'airs.dev', 0, 7051],
    setAnchorPeer_Students: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051],
    deployChainCode_Professors: ['documentchannel', 'Professors', 'professors', 'airs.dev', 0, 7051, 'course-certificates', '../chaincode/course-certificates'],
    deployChainCode_Students: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051, 'course-certificates', '../chaincode/course-certificates'],
    checkChainCodeCommitReadiness: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051, 'course-certificates'],
    approveChainCode_Professors: ['documentchannel', 'Professors', 'professors', 'airs.dev', 0, 7051, 'course-certificates', 'course-certificates_1.0:43a5c824aa7a530c8dbe1c640c9a31b8b08d28f651c91b353df65589249079a3'],
    approveChainCode_Students: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051, 'course-certificates', 'course-certificates_1.0:43a5c824aa7a530c8dbe1c640c9a31b8b08d28f651c91b353df65589249079a3'],
    commitChainCode: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051, 'course-certificates'],
    queryCommitted: ['documentchannel', 'Students', 'students', 'airs.dev', 0, 9051, 'course-certificates'],
    networkDown: []
}

app.get('/scripts/:script', (req, res) => {
    var script = req.params.script;
    console.log(script.split('_')[0]);
    let result = execScript(script.split('_')[0], args[script]?.join(' ') ?? '');
    res.send(result);
})

app.listen(3000, () => {
	console.log(`App running on port: 3000`);
});
