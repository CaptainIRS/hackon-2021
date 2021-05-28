const Course = {
  student: async (parent, args, { Student }, info) => {
    try {
      return await Student.findById(parent.student);
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
  prof: async (parent, args, { Prof }, info) => {
    try {
      return await Prof.findById(parent.profId);
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
  assignment: async (parent, args, { Assignment }, info) => {
    try {
      return await Assignment.findById(parent.assignment);
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
};

module.exports = Course;
