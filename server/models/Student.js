const Ottoman = require("ottoman");

const StudentModel = Ottoman.model("Student", {
  course: [
    {
      type: String,
      ref: "Course",
    },
  ],
  rollNumber: { type: String, required: true },
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
