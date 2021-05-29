const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar FileUpload

  # Query type
  type Query {
    studentCourse: [Course]
    studentNotInCourse: [Course]
    profCourse: [Course]
    profDetails: Prof
    studentDetails: Student
    assignment(id: String): Assignment
  }

  #Mutation Type
  type Mutation {
    createCourse(data: CreateCourseInput): Course
    createStudent(data: CreateStudentInput): Student
    createProf(data: CreateProfInput): Prof
    createSubmission(data: CreateSubmissionInput): Submission
    createStudymaterial(data: CreateStudymaterialInput): StudyMaterial
    createAssignment(data: CreateAssignmentInput): Assignment
    joinCourse(courseCode: String): Course
    singleUpload(file: Upload!): File
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
    studymaterial: [StudyMaterial]
  }

  type StudyMaterial {
    filename: String
    ipfsHash: String
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
    file: Upload
  }

  input CreateStudymaterialInput {
    courseCode: String
    file: Upload
  }
`;

module.exports = typeDefs;
