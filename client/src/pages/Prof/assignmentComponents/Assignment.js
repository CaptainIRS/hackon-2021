import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "preact-router/match";
const Assignment = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const auth = useSelector((state) => state.profauth);

  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className="justify-content-center">
            <span className="w-100 vertical-center ta-center">
              <Link href="/prof/NewAssignment">Create new Assignment</Link>
              <br />
              <br />
              <br />
              <Link href="/prof/ManageAssignments">Manage Assignment</Link>
            </span>
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Assignment;
