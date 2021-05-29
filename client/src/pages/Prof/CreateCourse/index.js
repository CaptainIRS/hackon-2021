import Sidebar from "../../../components/Prof/Sidebar";
import NavBar from "../../../components/Prof/Navbar";
import { Container, Row, Col } from "react-bootstrap";
import Join from "./Join";
export default function JoinClass() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className="cent justify-content-center">
            <Join />
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}
