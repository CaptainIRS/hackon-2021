import { useState } from "preact/hooks";
import { useSelector } from "react-redux";
import { Input } from "reactstrap";
import NavBar from "../../../components/Student/Navbar";
import Sidebar from "../../../components/Student/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATESUBMISSION } from "../../../graphql/mutations";

export default function SubmitWork({ id }) {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose file");

  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const [mutate] = useMutation(CREATESUBMISSION);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      mutate({ variables: { file, assignmentId: id } });
    } catch (err) {
      console.log(err);
    }
  };

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

          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

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
      <h5>Submission</h5>
      <form onSubmit={onSubmit}>
        <div className=" custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input dark2 text-white"
            id="customFile"
            onChange={onChange}
          />
          <br />
          <label
            className="custom-file-label dark2 text-white"
            htmlFor="customFile"
          >
            {filename}
          </label>
        </div>
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
