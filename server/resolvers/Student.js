const Student = {
  course: async (parent, args, { Course }, info) => {
    try {
      return await Course.findById(parent.course);
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
};

module.exports = Student;
