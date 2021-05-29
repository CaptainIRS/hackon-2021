import { useState, useEffect } from "preact/hooks";
import NavBar from "../../../components/Student/Navbar";
import Sidebar from "../../../components/Student/Sidebar";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { route } from "preact-router";
import { Table } from "reactstrap";
import { useQuery } from "@apollo/client";
import { STUDENTCOURSE } from "../../../graphql/query";
import { IPFS } from "../../../env";
const Assignments = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const { loading, data } = useQuery(STUDENTCOURSE);

  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [elements, setElements] = useState();

  useEffect(() => {
    if (!loading) {
      setSubjects(data.studentCourse);
      setIsloading(false);
      !theme
        ? setElements(
            data.studentCourse.map((subject, ind) => (
              <Table bordered striped key={ind}>
                <thead className="light2">
                  <tr>
                    <th>
                      <h4>
                        <u>{subject.courseCode}</u>
                      </h4>
                      {subject.prof.name}
                    </th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {subject.assignment.map((assignment, index) => (
                    <tr key={index}>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className="text-secondary">
                          {assignment.question}
                        </span>

                        <br />
                      </td>
                      <td align="right">
                        <Button
                          variant="light"
                          id={assignment.ipfsHash}
                          onClick={handleDownload}
                        >
                          Download QP
                        </Button>
                        <Button
                          variant="light"
                          id={assignment.id}
                          onClick={handleSubmission}
                        >
                          Submit Work
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ))
          )
        : setElements(
            data.studentCourse.map((subject, ind) => (
              <Table bordered dark striped key={ind}>
                <thead className="dark2">
                  <tr>
                    <th>
                      <h4>
                        <u>{subject.courseCode}</u>
                      </h4>
                      {subject.prof.name}
                    </th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {subject.assignment.map((assignment, index) => (
                    <tr key={index}>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className="text-white">
                          {assignment.question}
                        </span>
                      </td>
                      <td align="right">
                        <Button
                          variant="dark"
                          id={assignment.ipfsHash}
                          onClick={handleDownload}
                        >
                          Download QP
                        </Button>
                        <Button
                          variant="dark"
                          id={assignment.id}
                          onClick={handleSubmission}
                        >
                          Submit Work
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ))
          );
    }
  }, [data, loading, theme]);

  const handleDownload = (e) => {
    window.open(`${IPFS}/${e.target.id}`, "_blank");
  };

  const handleSubmission = (e) => {
    console.log(e.target.id);
    route(`/student/submit/${e.target.id}`, true);
  };

  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className=" justify-content-center">
            {!isLoading && subjects.length !== 0 ? (
              theme ? (
                <div className="dark-color">
                  <h2>Assignments</h2>
                  <br />
                  {elements}
                </div>
              ) : (
                <>
                  <h2>Assignments</h2>
                  <br />
                  {elements}
                </>
              )
            ) : theme ? (
              <div className="dark-color">
                <h2>Assignments</h2>
                <br />
                <span>No Assignments Sent</span>
              </div>
            ) : (
              <div>
                <h2>Assignments</h2>
                <br />
                <span>No Assignments Sent</span>
              </div>
            )}
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Assignments;
