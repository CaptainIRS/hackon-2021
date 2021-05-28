const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar FileUpload

  # Query type
  type Query {
    studentCourse: [String]
    studentNotInCourse: [Course]
    profCourse: [Course]
    profDetails: Prof
    studentDetails: Student
  }

  #Mutation Type
  type Mutation {
    createCourse(data: CreateCourseInput): Course
    createStudent(data: CreateStudentInput): Student
    createProf(data: CreateProfInput): Prof
    createSubmission(data: CreateSubmissionInput): Submission
    createAssignment(data: CreateAssignmentInput): Assignment
    joinCourse(id: String, courseCode: String): Course
    singleUpload(file: Upload!): File
    #submission(regno: Int, id: String, answersheet: Upload!): Submission
    #updateAssignment(data: CreateAssignmentInput, id: String, questionfile: Upload!): Assignment
  }

  #datatypes
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
    id: String
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

  #input types
  input CreateStudentInput {
    id: String
    name: String
    needsHelp: Boolean
    mentorName: String
  }

  input CreateProfInput {
    email: String
    name: String
    degree: String
    isDoc: Boolean
  }

  input CreateCourseInput {
    courseCode: String
  }

  input CreateAssignmentInput {
    question: String
    courseCode: String
    file: Upload
    durationDay: Int
    durationHr: Int
    durationMin: Int
  }

  input CreateSubmissionInput {
    assignmentId: String
    id: String
    file: Upload
  }
`;

module.exports = typeDefs;
