import { gql } from "@apollo/client";

export const CREATECOURSE = gql`
  mutation ($courseCode: String) {
    createCourse(data: { courseCode: $courseCode }) {
      courseCode
    }
  }
`;

export const CREATEPROF = gql`
  mutation ($email: String, $name: String) {
    createProf(data: { email: $email, name: $name }) {
      certificate
    }
  }
`;

export const CREATESTUDENT = gql`
  mutation ($email: String, $name: String) {
    createStudent(data: { email: $email, name: $name }) {
      certificate
    }
  }
`;

export const JOINCOURSE = gql`
  mutation ($courseCode: String) {
    joinCourse(courseCode: $courseCode) {
      courseCode
    }
  }
`;

export const MUTATION = gql`
  mutation ($file: Upload!) {
    singleUpload(file: $file) {
      filename
    }
  }
`;

export const CREATEASSIGNMENT = gql`
  mutation (
    $question: String
    $courseCode: String
    $file: Upload
    $durationDay: Int
    $durationHr: Int
    $durationMin: Int
  ) {
    createAssignment(
      data: {
        question: $question
        courseCode: $courseCode
        file: $file
        durationDay: $durationDay
        durationHr: $durationHr
        durationMin: $durationMin
      }
    ) {
      fileName
    }
  }
`;

export const CREATESUBMISSION = gql`
  mutation ($assignmentId: String, $file: Upload) {
    createSubmission(data: { assignmentId: $assignmentId, file: $file }) {
      fileName
    }
  }
`;

export const CREATESTUDYMATERIAL = gql`
  mutation ($courseCode: String, $file: Upload) {
    createStudymaterial(data: { courseCode: $courseCode, file: $file }) {
      filename
    }
  }
`;
