import NavBar from "../../../components/Prof/Navbar";
import Sidebar from "../../../components/Prof/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import FileUpload from "./FileUpload";
export default function StudyMaterial() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={8} className="cent justify-content-center">
            <FileUpload />
          </Col>
          <Col sm={4} className="d-flex justify-content-center">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}
