import { Fragment } from 'preact'
import NavBar from '../../../components/Student/Navbar'
import { Container, Row, Col } from 'react-bootstrap'
import CreatePoll from './File'
export default function TimeTable() {
    return (
        <Fragment>
            <NavBar />
            <Container fluid>
                <Row >
                    <Col sm={2} className="d-flex justify-content-center" >

                    </Col>
                    <Col sm={8} className="justify-content-center">
                        <center>
                            <CreatePoll />
                        </center>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-center" >

                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}