const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar FileUpload

  type Query {
    
  }

  type Mutation {

  }

  # datatypes
  type Assignment {
    id: String
    question: String
    courseCode: String
    fileName: String
    file: File
    ipfsHash: String
    durationDay: Int
    durationHr: Int
    durationMin: Int
    submissions: [Submission]
  }

  type Submission {
    rollNumber: String
    fileName: String
    file: File
    isLate: Boolean
    ipfsHash: String
  }

  type Course {
    id: String
    courseCode: String
    assignment: [Assignment]
    prof: Prof
    student: [Student]
  }

  type Prof {
    id: String
    email: String
    course: [Course]
    name: String
    degree: String
    certs: [File]
    isDoc: Boolean
  }

  type Student {
    id: String
    course: [Course]
    rollNumber: String
    name: String
    certs: [File]
    needsHelp: Boolean
    mentorName: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`;

module.exports = typeDefs;
