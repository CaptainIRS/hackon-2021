const Ottoman = require("ottoman");

const StudentModel = Ottoman.model("Student", {
  course: [
    {
      type: String,
      ref: "Course",
    },
  ],
  name: String,
  certs: [
    {
      type: String,
    },
  ],
  needsHelp: {
    type: Boolean,
    default: false,
  },
  mentorName: String,
});

module.exports = StudentModel;
