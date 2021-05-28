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
  connectionString: "couchbase://localhost",
  bucketName: couchbaseBucket,
  username: couchbaseUsername,
  password: couchbasePassword,
});

ottoman.ensureIndexes();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: async ({ req }) => {
    console.log(req.body);
    return {
      //All schemas here
    };
  },
});

server.applyMiddleware({ app, path: "/api" });

const port = PORT || 4000;
const host = IP || "localhost";

app.listen(port, host, () => {
  console.log(`Apollo Server on http://localhost:${port}/api`);
});
