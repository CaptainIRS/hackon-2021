import { useState, useEffect } from "preact/hooks";
import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Table } from "reactstrap";
import { route } from "preact-router";
import { useQuery } from "@apollo/client";
import { PROFCOURSE } from "../../../graphql/query";
const ManageAssignments = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const [subjects, setSubjects] = useState([]);

  const { loading, data } = useQuery(PROFCOURSE);
  const [isLoading, setIsloading] = useState(true);
  const [elements, setElements] = useState();

  const handleSubmissions = (e) => {
    route(`/prof/ViewSubmissions/${e.target.id}`, true);
  };

  useEffect(() => {
    if (!loading) {
      setSubjects(data.profCourse);
      setIsloading(false);
      console.log(theme);
      !theme
        ? setElements(
            data.profCourse.map((subject) => (
              <>
                <Table bordered striped>
                  <thead className="light2">
                    <tr>
                      <th>
                        <h4>
                          <u>{subject.courseCode}</u>
                        </h4>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.assignment.map((assignment) => (
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <span className="text-secondary">
                            {assignment.question}
                          </span>
                          <br />
                        </td>
                        <td align="right">
                          <Button
                            variant="light"
                            id={assignment.id}
                            onClick={handleSubmissions}
                          >
                            View Submissions
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <br />
                <br />
              </>
            ))
          )
        : setElements(
            data.profCourse.map((subject) => (
              <>
                <Table bordered dark striped>
                  <thead className="dark2">
                    <tr>
                      <th>
                        <h4>
                          <u>{subject.courseCode}</u>
                        </h4>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.assignment.map((assignment) => (
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <span className="text-white">
                            {assignment.question}
                          </span>
                        </td>
                        <td align="right">
                          <Button
                            variant="dark"
                            id={assignment.id}
                            onClick={handleSubmissions}
                          >
                            View Submissions
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <br />
                <br />
              </>
            ))
          );
    }
  }, [data, loading, theme]);

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

export default ManageAssignments;
