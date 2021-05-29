const Student = {
  course: async (parent, args, { Course }, info) => {
    if (!parent.course) {
      parent.course = [];
    }
    try {
      return parent.course.map(async (course) => {
        return await Course.findById(course);
      });
    } catch (error) {
      throw new Error("something went wrong!");
    }
  },
};

module.exports = Student;
