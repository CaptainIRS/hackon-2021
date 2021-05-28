const Ottoman = require("ottoman");

const CourseModel = Ottoman.model("Course", {
  courseCode: String,
  assignment: [
    {
      type: String,
      ref: "Assignment",
    },
  ],
  profId: String,
  student: [
    {
      type: String,
      ref: "Student",
    },
  ],
});

module.exports = CourseModel;
