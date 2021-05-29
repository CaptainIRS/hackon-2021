import { useSelector } from "react-redux";
import { useState, useEffect } from "preact/hooks";
import { Table } from "reactstrap";
import { Container, Row, Col, Button } from "react-bootstrap";
import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { useMutation, useQuery } from "@apollo/client";
import { STUDENTNOTINCOURSE } from "../../../graphql/query";
import { JOINCOURSE } from "../../../graphql/mutations";
const Courses = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const { loading, data } = useQuery(STUDENTNOTINCOURSE);
  const [mutate] = useMutation(JOINCOURSE);
  const [elements, setElements] = useState();

  useEffect(() => {
    if (!loading) {
      console.log(data);
      setElements(
        data.studentNotInCourse.map((res, index) => (
          <tr key={index}>
            <td>{res.prof.name}</td>
            <td>{res.courseCode}</td>
            <td>
              <Button
                variant="success"
                type="submit"
                onClick={() => {
                  mutate({ variables: { courseCode: res.courseCode } });
                }}
              >
                Join
              </Button>
            </td>
          </tr>
        ))
      );
    }
  }, [data, loading]);
  const light = (
    <div>
      <br />
      <h5>Courses</h5>
      <Table striped bordered>
        <thead>
          <th>Course Name</th>
          <th>Prof Name</th>
          <th>Join</th>
        </thead>
        <tbody>{elements}</tbody>
      </Table>
    </div>
  );
  const dark = (
    <div className="dark-color">
      <br />
      <h5 className="dark-color">Courses</h5>
      <Table striped dark bordered>
        <thead>
          <th>Test Type</th>
          <th>Course Code</th>
          <th>Marks</th>
        </thead>
        <tbody>{elements}</tbody>
      </Table>
    </div>
  );
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className="cent justify-content-center">
            {theme ? dark : light}
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Courses;
