import NavBar from "../../../components/Prof/Navbar";
import { useSelector } from 'react-redux'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Table } from 'reactstrap'
import { BACKEND, IPFS } from '../../../env'
import axios from 'axios'
import { useState, useEffect } from "preact/hooks";
const Sentfiles = () => {
    const user = useSelector(state => state.user)
    const theme = user.theme
    const [blockchainfiles, setArray] = useState([])
    useEffect(() => {
        const { data } = axios.post(`${BACKEND}/admin/toverify`, {
        }).then(res => setArray(res.data))
    }, [])
    const change = async (e) => {
        console.log(e.target.id)
        await axios.post(`${BACKEND}/signpdf/${e.target.id}`)
            .then((req) => {
                console.log(req.data)
                setTimeout(() => { }, 2000)
                setArray(req.data)
            })
    }
    const subjects = ["BONAFIDE"]
    const light = subjects.map((subject) =>
    (<>
        <Table striped >
            <thead className="light2"><tr><th><h4><u>{subject}</u></h4></th></tr></thead>
            <tbody>
                {blockchainfiles.map((blockchainfile, index) => blockchainfile && subject === blockchainfile.type ?
                    <><tr><td><a className="text-secondary" rel="noopener noreferrer" href={`${IPFS}/${blockchainfile.hash}`} target="_blank" >{`${blockchainfile.hash}.pdf`}</a></td>
                        <td><Button onClick={change} id={blockchainfile.hash} variant="warning" className="right-it">
                            Verified Document Sign It and Send
            </Button></td>
                    </tr>
                    </>
                    : null)}
            </tbody>
        </Table>
        <br />
        <br />
    </>)
    )
    const dark = subjects.map((subject) =>
    (<>

        <Table bordered dark striped>
            <thead className="dark2"><tr><th><h4><u>{subject}</u></h4></th></tr></thead>
            <tbody>
                {blockchainfiles.map((blockchainfile, index) => blockchainfile && subject === blockchainfile.type ?
                    <tr><td><a className="text-white" rel="noopener noreferrer" href={`${IPFS}/${blockchainfile.hash}`} target="_blank" >{`${blockchainfile.hash}.pdf`}</a></td>
                        <td><Button onClick={change} id={blockchainfile.hash} variant="warning" className="right-it">
                            Verified Document Sign It and Send
            </Button></td>
                    </tr>

                    : null)}
            </tbody>
        </Table>
        <br />
        <br />
    </>)
    )
    return (
        <>
            <NavBar />
            <Container fluid>
                <Row >
                    <Col sm={2} className=" justify-content-center"></Col>
                    <Col sm={8} className=" justify-content-center">
                        {theme ? <div className="dark-color">
                            <h2>Recieved Document for Verification</h2>
                            <br />{dark}</div> : <><h2>Recieved Document for Verification</h2>
                            <br />{light}</>}
                    </Col>
                    <Col sm={2} className=" justify-content-center"></Col>
                </Row>
            </Container>
        </>
    );
}

export default Sentfiles;
