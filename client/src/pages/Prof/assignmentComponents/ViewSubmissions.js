import { useState, useEffect } from "preact/hooks";
import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Table } from "reactstrap";
import { useQuery } from "@apollo/client";
import { ASSIGNMENT, PROFCOURSE } from "../../../graphql/query";
import { Button } from "@material-ui/core";
import { IPFS } from "../../../env";
const ViewSubmissions = ({ id }) => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const { data, loading } = useQuery(ASSIGNMENT, { variables: { id: id } });
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [elements, setElements] = useState();

  useEffect(() => {
    if (!loading) {
      console.log(data.assignment.submissions);
      setSubjects(data.assignment.submissions);
      setIsloading(false);
      !theme
        ? setElements(
            <>
              <Table bordered striped>
                <thead className="light2">
                  <tr>
                    <th>
                      <h4>
                        <u>{data.assignment.courseCode}</u>
                      </h4>
                      {data.assignment.question}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignment.submissions.map((submission) => (
                    <tr>
                      <td>
                        <a href={`${IPFS}/${submission.ipfsHash}`}>
                          <span className="text-secondary">
                            {`${submission.fileName}${
                              submission.islate ? ": late" : ""
                            }`}
                          </span>
                        </a>

                        <br />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <br />
              <br />
            </>
          )
        : setElements(
            <>
              <Table bordered dark striped>
                <thead className="dark2">
                  <tr>
                    <th>
                      <h4>
                        <u>{data.assignment.courseCode}</u>
                      </h4>
                      {data.assignment.question}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignment.submissions.map((submission) => (
                    <tr>
                      <td>
                        <a href={`${IPFS}/${submissions.ipfsHash}`}>
                          <span className="text-white">
                            {`${submission.fileName}${
                              submission.islate ? ": late" : ""
                            }`}
                          </span>
                        </a>
                        <br />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <br />
              <br />
            </>
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
                  <h2>Submissions</h2>
                  <br />
                  {elements}
                </div>
              ) : (
                <>
                  <h2>Submissions</h2>
                  <br />
                  {elements}
                </>
              )
            ) : theme ? (
              <div className="dark-color">
                <h2>Submissions</h2>
                <br />
                <span>No Submissions</span>
              </div>
            ) : (
              <div>
                <h2>Submissions</h2>
                <br />
                <span>No Submissions</span>
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

export default ViewSubmissions;
