const Ottoman = require("ottoman");

const AssignmentModel = Ottoman.model("Assignment", {
  question: String,
  courseCode: String,
  fileName: String,
  ipfsHash: String,
  uploadedTime: Number,
  durationDay: Number,
  durationHr: Number,
  durationMin: Number,
  submissions: [
    {
      ipfsHash: String,
      rollNumber: String,
      fileName: String,
      isLate: Boolean,
    },
  ],
});

module.exports = AssignmentModel;
