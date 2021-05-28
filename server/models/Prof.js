const Ottoman = require("ottoman");

const ProfModel = Ottoman.model("Prof", {
  email: String,
  course: [
    {
      type: String,
      ref: "Course",
    },
  ],
  name: String,
  degree: String,
  certs: [
    {
      type: String,
    },
  ],
  isDoc: Boolean,
});

module.exports = ProfModel;
