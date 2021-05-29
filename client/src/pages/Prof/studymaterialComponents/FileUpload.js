import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "preact/hooks";
import { useSelector } from "react-redux";
import { Input } from "reactstrap";
import { CREATESTUDYMATERIAL } from "../../../graphql/mutations";
import { PROFCOURSE } from "../../../graphql/query";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const [course, setcourse] = useState();
  const [subjects, setSubjects] = useState([]);

  const { loading, data } = useQuery(PROFCOURSE);

  const [mutate] = useMutation(CREATESTUDYMATERIAL);

  useEffect(() => {
    if (!loading) {
      console.log(data);
      setSubjects(data.profCourse);
      setcourse(
        data.profCourse.map((op, ind) => (
          <option key={ind} value={op.courseCode}>
            {op.courseCode}
          </option>
        ))
      );
    }
  }, [data, loading]);

  const [subject, setSubject] = useState("");
  const ss = (e) => setSubject(e.target.value);
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      mutate({ variables: { file, courseCode: subject } });
    } catch (err) {
      console.log(err);
    }
  };

  const light = (
    <div>
      <br />
      <h5>Study Material</h5>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <br />
          <Input type="select" onChange={ss}>
            {subjects.length !== 0 ? (
              <option>Select Course code</option>
            ) : (
              <option>Join a class </option>
            )}
            {course}
          </Input>
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </div>
  );
  const dark = (
    <div className="dark-color">
      <br />
      <h5>Study Material</h5>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input dark2 text-white"
            id="customFile"
            onChange={onChange}
          />
          <br />
          <Input type="select" onChange={ss} className="dark2 text-white">
            {subjects.length !== 0 ? (
              <option>Select Course code</option>
            ) : (
              <option>Join a class </option>
            )}
            {course}
          </Input>
          <label
            className="custom-file-label dark2 text-white"
            htmlFor="customFile"
          >
            {filename}
          </label>
        </div>
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </div>
  );
  return theme ? dark : light;
};

export default FileUpload;
