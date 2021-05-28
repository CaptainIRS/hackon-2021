const Query = require("./Query");
const Mutation = require("./Mutation");
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
  FileUpload: GraphQLUpload,
  Query,
  Mutation,
};

module.exports = resolvers;
