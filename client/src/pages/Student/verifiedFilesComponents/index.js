import NavBar from "../../../components/Student/Navbar";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Table } from "reactstrap";
import { BACKEND, IPFS } from "../../../env";
import axios from "axios";
import { useState, useEffect } from "preact/hooks";
const Sentfiles = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const [blockchainfiles, setArray] = useState([]);
  useEffect(() => {
    axios.post(`${BACKEND}/userall/sent`, {}).then((res) => setArray(res.data));
  }, []);
  const subjects = ["BONAFIDE"];
  const light = subjects.map((subject) => (
    <>
      <Table bordered striped>
        <thead className="light2">
          <tr>
            <th>
              <h4>
                <u>{subject}</u>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {blockchainfiles.map((blockchainfile, index) =>
            subject === blockchainfile.type ? (
              <tr>
                <td>
                  <a
                    className="text-secondary"
                    rel="noopener noreferrer"
                    href={`${IPFS}/${blockchainfile.hash}`}
                    target="_blank"
                  >{`${index + 1}.${subject}`}</a>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>
      <br />
      <br />
    </>
  ));
  const dark = subjects.map((subject) => (
    <>
      <Table bordered dark striped>
        <thead className="dark2">
          <tr>
            <th>
              <h4>
                <u>{subject}</u>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {blockchainfiles.map((blockchainfile, index) =>
            subject === blockchainfile.type ? (
              <tr>
                <td>
                  <a
                    className="text-white"
                    rel="noopener noreferrer"
                    href={`${IPFS}/${blockchainfile.hash}`}
                    target="_blank"
                  >{`${index + 1}.${subject}`}</a>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>
      <br />
      <br />
    </>
  ));
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col sm={2} className=" justify-content-center"></Col>
          <Col sm={8} className=" justify-content-center">
            {theme ? (
              <div className="dark-color">
                <h2>Verified Files</h2>
                <br />
                {dark}
              </div>
            ) : (
              <>
                <h2>Verified Files</h2>
                <br />
                {light}
              </>
            )}
          </Col>
          <Col sm={2} className=" justify-content-center"></Col>
        </Row>
      </Container>
    </>
  );
};

export default Sentfiles;
