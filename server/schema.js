const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar FileUpload
`;

module.exports = typeDefs;