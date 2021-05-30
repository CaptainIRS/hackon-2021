import NavBar from "../../../components/Student/Navbar";
import Sidebar from "../../../components/Student/Sidebar";

import { useState, useEffect } from "preact/hooks";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Table } from "reactstrap";
import { useQuery } from "@apollo/client";
import { STUDENTCOURSE } from "../../../graphql/query";
import { IPFS } from "../../../env";
const StudyMaterials = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const { data, loading } = useQuery(STUDENTCOURSE);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [elements, setElements] = useState();

  useEffect(() => {
    if (!loading) {
      console.log(data.studentCourse);
      setSubjects(data.studentCourse);
      setIsloading(false);
      !theme
        ? setElements(
            data.studentCourse.map((subject) => (
              <>
                <Table bordered striped>
                  <thead className="light2">
                    <tr>
                      <th>
                        <h4>
                          <u>{subject.courseCode}</u>
                        </h4>
                        {subject.prof.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.studymaterial.map((studymaterial) => (
                      <tr>
                        <td>
                          <a
                            className="text-secondary"
                            rel="noopener noreferrer"
                            href={`${IPFS}/${studymaterial.ipfsHash}`}
                            target="_blank"
                          >
                            {studymaterial.filename}
                          </a>
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
            data.studentCourse.map((subject) => (
              <>
                <Table bordered dark striped>
                  <thead className="dark2">
                    <tr>
                      <th>
                        <h4>
                          <u>{subject.courseCode}</u>
                        </h4>
                        {subject.prof.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.studymaterial.map((studymaterial) => (
                      <tr>
                        <td>
                          <a
                            rel="noopener noreferrer"
                            href={`${IPFS}/${studymaterial.ipfsHash}`}
                            className="text-white"
                            target="_blank"
                          >
                            {studymaterial.filename}
                          </a>
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
                  <h2>Study Material</h2>
                  <br />
                  {elements}
                </div>
              ) : (
                <>
                  <h2>Study Material</h2>
                  <br />
                  {elements}
                </>
              )
            ) : theme ? (
              <div className="dark-color">
                <h2>Study Material</h2>
                <br />
                <span>No Study Materials Sent</span>
              </div>
            ) : (
              <div>
                <h2>Study Material</h2>
                <br />
                <span>No Study Materials Sent</span>
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

export default StudyMaterials;
