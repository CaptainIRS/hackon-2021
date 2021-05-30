const { createWriteStream, mkdir } = require("fs");
const path = require("path");
const { addFileToIPFS } = require("../utils/ipfsHandlers");
const { generateCertificate } = require('../utils/certificateGenerator');

const Mutation = {
  createStudent: async (parent, { data }, { Student }, info) => {
    try {
      const student = new Student(data);
      const savedStudent = await student.save();
      const certificate = await generateCertificate(savedStudent.id, savedStudent.email, 'Student');
      return { certificate };
    } catch (err) {
      throw new Error("Unable to create student.");
    }
  },
  createProf: async (parent, { data }, { Prof }, info) => {
    try {
      const prof = new Prof(data);
      const savedProf = await prof.save();
      const certificate = await generateCertificate(savedProf.id, savedProf.email, 'Professor');
      return { certificate };
    } catch (err) {
      throw new Error("Unable to create professor.");
    }
  },
  createCourse: async (parent, { data }, { user, Course, Prof }, info) => {
    try {
      let course = new Course({ courseCode: data.courseCode, prof: user.id });
      course = await course.save();
      let prof = await Prof.findById(user.id);
      if (!prof.course) {
        prof.course = [];
      }
      prof.course.push(course.id);
      await prof.save();
      return course;
    } catch (err) {
      throw new Error("Unable to create course.");
    }
  },
  singleUpload: async (parent, data) => {
    try {
      mkdir("FileUploads", { recursive: true }, (err) => {
        if (err) throw err;
      });
      const { createReadStream, filename } = await data.file;
      const writePath = path.join(__dirname, "../FileUploads", filename);
      await new Promise((resolve) =>
        createReadStream()
          .pipe(createWriteStream(path.join(writePath)))
          .on("close", resolve)
      );
      const ipfsHash = await addFileToIPFS(writePath);
      console.log(ipfsHash);
      return await data.file;
    } catch (error) {
      throw new Error(error);
    }
  },
  createStudymaterial: async (parent, { data }, { Course }, info) => {
    try {
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
      let studymaterial = {
        ipfsHash,
        filename,
      };
      const course = await Course.findOne({ courseCode: data.courseCode });
      if (!course.studymaterial) {
        course.studymaterial = [];
      }
      course.studymaterial.push(studymaterial);
      await course.save();
      return studymaterial;
    } catch (e) {
      throw new Error(e);
    }
  },
  createAssignment: async (parent, { data }, { Assignment, Course }, info) => {
    try {
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
  createSubmission: async (parent, { data }, { user, Assignment }, info) => {
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
    if (!assignment.submissions) assignment.submissions = [];
    if (
      assignment.uploadedTime +
        86400000 * assignment.durationDay +
        3600000 * assignment.durationHr +
        60000 * assignment.durationMin >=
      currtime
    ) {
      assignment.submissions.push({
        rollNumber: user.id,
        fileName: filename,
        ipfsHash: ipfsHash,
        isLate: false,
      });
      await assignment.save();
      return {
        fileName: filename,
        ipfsHash: ipfsHash,
        isLate: false,
      };
    } else {
      assignment.submissions.push({
        rollNumber: user.id,
        fileName: filename,
        ipfsHash: ipfsHash,
        isLate: true,
      });
      await assignment.save();
      return {
        fileName: filename,
        ipfsHash: ipfsHash,
        isLate: true,
      };
    }
  },
  joinCourse: async (parent, args, { user, Student, Course }, info) => {
    try {
      const student = await Student.findById(user.id);
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
      course.student.push(user.id);
      return await course.save();
    } catch (err) {
      throw new Error("Unable to join course");
    }
  },
};

module.exports = Mutation;
