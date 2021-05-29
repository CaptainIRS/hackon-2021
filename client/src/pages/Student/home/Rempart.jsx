import { Row, Col, Container } from "react-bootstrap";
import Sidebar from "../../../components/Student/Sidebar";
import Boxes from "./Boxes";
export default function Rempart() {
  return (
    <Container fluid>
      <Row>
        <Col sm={8} className="cent justify-content-center">
          <Boxes />
        </Col>
        <Col sm={4} className="d-flex justify-content-center">
          <Sidebar />
        </Col>
      </Row>
    </Container>
  );
}
