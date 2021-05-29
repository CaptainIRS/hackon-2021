const Ottoman = require("ottoman");

const CourseModel = Ottoman.model("Course", {
  courseCode: String,
  assignment: [
    {
      type: String,
      ref: "Assignment",
    },
  ],
  prof: {
    type: String,
    ref: "Prof",
  },
  student: [
    {
      type: String,
      ref: "Student",
    },
  ],
  studymaterial: [
    {
      ipfsHash: String,
      filename: String,
    },
  ],
});

module.exports = CourseModel;
