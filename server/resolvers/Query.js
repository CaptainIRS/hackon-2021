const Query = {
  studentCourse: async (parent, args, { user, Student, Course }, info) => {
    try {
      const student = await Student.findOneById(user.id);
      console.log(student.course);
      const courseIds = student.course;

      return courses;
    } catch (err) {
      throw new Error(err);
    }
  },
  studentNotInCourse: async (parent, args, { user, Student, Course }, info) => {
    try {
      let courses = await Course.find({});
      const student = await Student.findOneById(user.id);
      let studentCourse = student.course;
      let intersection = courses.rows.filter(
        (x) => !studentCourse.includes(x.id)
      );
      return intersection;
    } catch (err) {
      throw new Error(err);
    }
  },
  profCourse: async (parent, args, { user, Prof, Course }, info) => {
    try {
      const prof = await Prof.findById(user.id);
      const courseIds = prof.course;
      const courses = [];
      for (id of courseIds) {
        let course = await Course.findById(id);
        courses.push(course.courseCode);
      }
      return courses;
    } catch (err) {
      throw new Error(err);
    }
  },

  profDetails: async (parent, args, { user, Prof }, info) => {
    try {
      const prof = await Prof.findById(user.id);
      return {
        email: prof.email,
        name: prof.name,
        degree: prof.degree,
        isDoc: prof.isDoc,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  studentDetails: async (parent, args, { user, Student }, info) => {
    try {
      console.log(args);
      return await Student.findOneById(user.id);
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = Query;
