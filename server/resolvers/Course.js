const Course = {
  student: async (parent, args, { Student }, info) => {
    try {
      return parent.student.map(async (student) => {
        return await Student.findById(student);
      });
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
  prof: async (parent, args, { Prof }, info) => {
    try {
      return await Prof.findById(parent.prof);
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
  assignment: async (parent, args, { Assignment }, info) => {
    try {
      if (!parent.assignment) {
        parent.assignment = [];
      }
      return parent.assignment.map(async (assignments) => {
        return await Assignment.findById(assignments);
      });
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong!");
    }
  },
};

module.exports = Course;
