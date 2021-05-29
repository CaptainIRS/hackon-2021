import { gql } from "@apollo/client";

export const STUDENT = gql`
  query studentDetails {
    studentDetails {
      name
    }
  }
`;

export const STUDENTCOURSE = gql`
  query studentCourse {
    studentCourse {
      courseCode
      prof {
        name
      }
      assignment {
        id
        question
        ipfsHash
      }
      studymaterial {
        filename
        ipfsHash
      }
    }
  }
`;

export const STUDENTNOTINCOURSE = gql`
  query studentNotInCourse {
    studentNotInCourse {
      courseCode
      id
      prof {
        name
      }
    }
  }
`;

export const PROF = gql`
  query profDetails {
    profDetails {
      name
      email
    }
  }
`;

export const PROFCOURSE = gql`
  query profCourse {
    profCourse {
      courseCode
      assignment {
        id
        question
        submissions {
          id
          fileName
          isLate
          ipfsHash
        }
      }
    }
  }
`;

export const ASSIGNMENT = gql`
  query assignment($id: String) {
    assignment(id: $id) {
      courseCode
      submissions {
        ipfsHash
        fileName
        rollNumber
        isLate
      }
    }
  }
`;
