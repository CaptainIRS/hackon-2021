const { createWriteStream, mkdir } = require("fs");
const path = require("path");
const couchbase = require("couchbase");
const { addFileToIPFS } = require("../utils/ipfsHandlers");

const Mutation = {
  createStudent: async (parent, { data }, { Student }, info) => {
    try {
      const student = new Student(data);
      return await student.save();
    } catch (err) {
      throw new Error("Unable to create student.");
    }
  },
  createProf: async (parent, { data }, { Prof }, info) => {
    try {
      const prof = new Prof(data);
      return await prof.save();
    } catch (err) {
      throw new Error("Unable to create professor.");
    }
  },
  createCourse: async (parent, { data }, { user, Course, Prof }, info) => {
    try {
      let course = new Course(data);
      course = await course.save();
      let prof = await Prof.findById(user.id);
      console.log(prof);
      if (!prof.course) {
        prof.course = [];
      }
      prof.course.push(course.id);
      await prof.save();
      return course;
    } catch (err) {
      console.log(err);
      throw new Error("Unable to create course.");
    }
  },
  singleUpload: async (parent, data) => {
    console.log(await data.file);
    try {
      console.log(await data.file);
      mkdir("FileUploads", { recursive: true }, (err) => {
        if (err) throw err;
      });

      const { createReadStream, filename } = await data.file;
      await new Promise((resolve) =>
        createReadStream()
          .pipe(
            createWriteStream(path.join(__dirname, "../FileUploads", filename))
          )
          .on("close", resolve)
      );

      return await data.file;
    } catch (error) {
      throw new Error(error);
    }
  },
  createAssignment: async (parent, { data }, { Assignment, Course }, info) => {
    try {
      // console.log(data);
      const { createReadStream, filename } = await data.file;
      mkdir("FileUploads", { recursive: true }, (err) => {
        if (err) throw err;
      });
      const writePath = path.join(__dirname, "../FileUploads", filename);
      await new Promise((resolve) =>
        createReadStream()
          .pipe(createWriteStream(writePath))
          .on("close", resolve)
      );
      const ipfsHash = await addFileToIPFS(writePath);

      let assignment = new Assignment({
        question: data.question,
        courseCode: data.courseCode,
        fileName: filename,
        ipfsHash: ipfsHash,
        uploadedTime: Date.now(),
        durationDay: data.durationDay,
        durationHr: data.durationHr,
        durationMin: data.durationMin,
      });
      assignment = await assignment.save();
      const course = await Course.findOne({ courseCode: data.courseCode });
      if (!course.assignment) {
        course.assignment = [];
      }
      course.assignment.push(assignment.id);
      await course.save();
      return assignment;
    } catch (error) {
      throw new Error(error);
    }
  },
  createSubmission: async (parent, { data }, { Assignment }, info) => {
    const currtime = Date.now();
    const { createReadStream, filename } = await data.file;
    mkdir("FileUploads", { recursive: true }, (err) => {
      if (err) throw err;
    });
    const writePath = path.join(__dirname, "../FileUploads", filename);
    await new Promise((resolve) =>
      createReadStream().pipe(createWriteStream(writePath)).on("close", resolve)
    );
    const ipfsHash = await addFileToIPFS(writePath);
    const assignment = await Assignment.findById(data.assignmentId);
    if (
      assignment.uploadedTime +
        86400000 * assignment.durationDay +
        3600000 * assignment.durationHr +
        60000 * assignment.durationMin >=
      currtime
    ) {
      assignment.submission.push({
        rollNumber: data.rollNumber,
        fileName: filename,
        ipfsHash: ipfsHash,
        isLate: false,
      });
      await assignment.save();
      return {
        rollNumber: data.rollNumber,
        fileName: filename,
        ipfsHash: filename,
        isLate: false,
      };
    } else {
      assignment.submission.push({
        rollNumber: data.rollNumber,
        fileName: filename,
        ipfsHash: filename,
        isLate: true,
      });
      await assignment.save();
      return {
        rollNumber: data.rollNumber,
        fileName: filename,
        ipfsHash: filename,
        isLate: true,
      };
    }
  },
  joinCourse: async (parent, args, { user, Student, Course }, info) => {
    try {
      const student = await Student.findOneById(user.id);
      const course = await Course.findOne({ courseCode: args.courseCode });
      if (!course) {
        throw new Error();
      }
      if (!student.course) {
        student.course = [];
      }
      student.course.push(course.id);
      await student.save();

      if (!course.student) {
        course.student = [];
      }
      course.student.push(student.id);
      return await course.save();
    } catch (err) {
      throw new Error("Unable to join course");
    }
  },
};

module.exports = Mutation;
