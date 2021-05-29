const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { Ottoman } = require("ottoman");
const bodyParser = require("body-parser");

const {
  PORT,
  IP,
  couchbaseBucket,
  couchbasePassword,
  couchbaseUsername,
  couchbaseString,
} = require("./env");

const schema = require("./schema");
const resolvers = require("./resolvers");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Ottoman Settings
const ottoman = new Ottoman({ collectionName: "_default" });

ottoman.connect({
  connectionString: couchbaseString,
  bucketName: couchbaseBucket,
  username: couchbaseUsername,
  password: couchbasePassword,
});

ottoman.ensureIndexes();

const Assignment = require("./models/Assignment");
const Course = require("./models/Course");
const Prof = require("./models/Prof");
const Student = require("./models/Student");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: async ({ req }) => {
    console.log(req.body);
    let userType = req.headers["x-user"].match(/OU=(.*?),/)[1];
    let id = req.headers["x-user"].match(/CN=(.*?),/)[1];
    let user = {
      userType,
      id,
    };

    // let user = {
    //   id: "2209e140-9521-408d-b8fe-275dc76747e0",
    //   userType: "Prof",
    // };

    // let user = {
    //   id: "7bb6a4b8-162c-476a-8af5-bb6447355439",
    //   userType: "Student",
    // };

    return {
      user,
      Assignment,
      Course,
      Prof,
      Student, //All schemas here
    };
  },
});

server.applyMiddleware({ app, path: "/api" });

const port = PORT || 4000;
const host = IP || "localhost";

app.get("/file/:ipfsHash", (req, res) => {
  const ipfsHash = req.params.ipfsHash;
  // ipfs fetch code @anirudh and save it in FileUploads
  // var filename = __dirname+`/FileUploads/${filename}`;
  // var readstream = fs.createReadStream(filename);
  // readStream.on("open", function () {
  //   readStream.pipe(res);
  // });
});

app.listen(port, host, () => {
  console.log(`Apollo Server on http://localhost:${port}/api`);
});
