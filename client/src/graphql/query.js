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
    }
  }
`;

export const PROFASSIGNMENTS = gql`
  query profCourse {
    profCourse {
      assignments {
        question
        courseCode
        ipfsHash
        durationDay
        durationHr
        durationMin
      }
    }
  }
`;
