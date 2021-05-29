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
      id
      name
    }
  }
`;

export const CREATESTUDENT = gql`
  mutation ($name: String) {
    createStudent(data: { name: $name }) {
      id
      name
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
