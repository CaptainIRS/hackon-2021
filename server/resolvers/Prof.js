const Prof = {
  course: async (parent, args, { Course }, info) => {
    console.log(parent.course);
    try {
      return parent.course.map(async (course) => {
        return await Course.findById(course);
      });
    } catch (error) {
      // console.log(error)
      throw new Error("something went wrong!");
    }
  },
};

module.exports = Prof;
