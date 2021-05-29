import { useState, useEffect } from "preact/hooks";
import { useSelector } from "react-redux";
import { Input } from "reactstrap";
import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { PROFCOURSE } from "../../../graphql/query";
import { CREATEASSIGNMENT } from "../../../graphql/mutations";

export default function NewAssignment() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose file");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [hr, setHr] = useState("");
  const [min, setMin] = useState("");

  const { loading, data } = useQuery(PROFCOURSE);
  const [mutate] = useMutation(CREATEASSIGNMENT);
  const [subjects, setSubjects] = useState([]);
  const [coursecodeoptions, setcourse] = useState();

  useEffect(() => {
    if (!loading) {
      setSubjects(data.profCourse);
      setcourse(
        data.profCourse.map((op) => (
          <option value={op.courseCode}>{op.courseCode}</option>
        ))
      );
    }
  }, [data, loading]);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const ss = (e) => setSubject(e.target.value);
  const qq = (e) => setQuestion(e.target.value);
  const dd = (e) => setDate(e.target.value);
  const hh = (e) => setHr(e.target.value);
  const mm = (e) => setMin(e.target.value);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({
        question,
        file,
        courseCode: subject,
        durationDay: parseInt(date),
        durationHr: parseInt(hr),
        durationMin: parseInt(min),
      });
      mutate({
        variables: {
          question,
          file,
          courseCode: subject,
          durationDay: parseInt(date),
          durationHr: parseInt(hr),
          durationMin: parseInt(min),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const light = (
    <div>
      <br />
      <h5>Assignment</h5>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <br />

          <br />
          <Input type="select" onChange={ss}>
            {subjects.length !== 0 ? (
              <option>Select Course name</option>
            ) : (
              <option>Join a class </option>
            )}
            {coursecodeoptions}
          </Input>
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <input
          type="text"
          onChange={qq}
          className="form-control mt-4"
          placeholder="EnterQuestion"
        />
        <br />
        <input
          type="text"
          onChange={dd}
          className="form-control mt-4"
          placeholder="Enter Deadline Date"
        />
        <input
          type="text"
          onChange={hh}
          className="form-control mt-4"
          placeholder="Enter Deadline Hours"
        />
        <input
          type="text"
          onChange={mm}
          className="form-control mt-4"
          placeholder="Enter Deadline Mins"
        />
        <br />
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
      <h5>Assignment</h5>
      <form onSubmit={onSubmit}>
        <div className=" custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input dark2 text-white"
            id="customFile"
            onChange={onChange}
          />

          <br />

          <br />
          <Input type="select" onChange={ss} className="dark2 text-white">
            {subjects.length !== 0 ? (
              <option>Select Course code</option>
            ) : (
              <option>Join a class </option>
            )}
            {coursecodeoptions}
          </Input>
          <label
            className="custom-file-label dark2 text-white"
            htmlFor="customFile"
          >
            {filename}
          </label>
        </div>
        <input
          type="text"
          onChange={qq}
          className="form-control dark2 text-white mt-4"
          placeholder="EnterQuestion"
        />
        <br />
        <input
          type="text"
          onChange={dd}
          className="form-control dark2 text-white mt-4"
          placeholder="Enter Deadline Date"
        />
        <input
          type="text"
          onChange={hh}
          className="form-control dark2 text-white mt-4"
          placeholder="Enter Deadline Hours"
        />
        <input
          type="text"
          onChange={mm}
          className="form-control dark2 text-white mt-4"
          placeholder="Enter Deadline Mins"
        />
        <br />
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </div>
  );
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className="justify-content-center">
            {/* <span className="w-100 vertical-center ta-center">
                            <Link to="/prof/NewAssignment">
                                Create new Assignment
                            </Link>
                            <br />
                            <br />
                            <br />
                            <Link to="/prof/ManageAssignments">
                                Manage Assignment
                            </Link>
                        </span> */}
            {theme ? dark : light}
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}
