const Query = require("./Query");
const Mutation = require("./Mutation");
const Course = require("./Course");
const Prof = require("./Prof");
const Student = require("./Student");
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
  FileUpload: GraphQLUpload,
  Query,
  Mutation,
  Course,
  Prof,
  Student,
};

module.exports = resolvers;
