import { useState } from "preact/hooks";
import sidebanner from "../assets/images/sidebannerall.png";
import { route } from "preact-router";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Input } from "reactstrap";
import { REGISTER } from "../env";
export default function FirstPage() {
  const [state, setstate] = useState();
  const change = (e) => {
    setstate(e.target.value);
  };
  const proceed = () => {
    if (state == "Student") {
      window.location.assign(REGISTER + "student/register");
    }
    if (state == "Professor")
      window.location.assign(REGISTER + "prof/register");
  };
  return (
    <Container fluid className="h100">
      <Row className="h-100">
        <Col md={6}>
          <Image src={`${sidebanner}`} rounded id="sizer" />
        </Col>
        <Col md={6} className="h-100">
          <div className="form-box vertical-center">
            <h2> PORTAL</h2>
            <hr />
            <Input type="select" onChange={change}>
              <option>Choose</option>
              <option value={"Professor"}>Professor</option>
              <option value={"Student"}>Student</option>
            </Input>
            <br />
            <Button variant="primary" onClick={proceed}>
              Proceed
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
