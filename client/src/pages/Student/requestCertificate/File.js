import { useState } from "preact/hooks";
import { useSelector } from "react-redux";
import { Button, Alert } from "react-bootstrap";
import { Input } from "reactstrap";
import axios from "axios";
import { BACKEND } from "../../../env";
export default function CreatePoll() {
  const [msg, setmsg] = useState("");
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const [show, setShow] = useState(true);
  const Show = () => setShow(false);
  const [rollno, setRollno] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [dept, setDept] = useState("");
  const [purpose, setPuropse] = useState("");
  const Submit = (e) => {
    e.preventDefault();
    if (
      rollno === "" ||
      year === "" ||
      course === "" ||
      dept === "" ||
      purpose === ""
    )
      setmsg("Please Enter All The Fields");
    else {
      const obj = { name, rollno, year, dept, course, purpose, username: name };
      const body = JSON.stringify(obj);
      console.log(body);
      axios.post(`${BACKEND}/certs`, obj).then((res) => {
        console.log(res);
      });
      setShow(true);
    }
  };
  const light = (
    <>
      <br />
      <h4>Bonafide</h4>
      {msg ? <Alert variant="danger"> {msg}</Alert> : null}
      {show ? (
        <Button onClick={Show} variant="primary">
          Request a bonafide
        </Button>
      ) : (
        <>
          <br />
          <Input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Rollno"
            onChange={(e) => setRollno(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Course"
            onChange={(e) => setCourse(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Department"
            onChange={(e) => setDept(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Purpose"
            onChange={(e) => setPuropse(e.target.value)}
          />
          <br />
          <Button onClick={Submit} variant="warning">
            Request a bonafide
          </Button>
        </>
      )}
    </>
  );
  const dark = (
    <>
      <br />
      <h4 className="dark-color">Bonafide</h4>
      {msg ? <Alert variant="danger"> {msg}</Alert> : null}
      {show ? (
        <Button onClick={Show} variant="primary">
          Request a bonafide
        </Button>
      ) : (
        <>
          <br />
          <Input
            type="text"
            placeholder="Name"
            className="dark2 text-white"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Rollno"
            className="dark2 text-white"
            onChange={(e) => setRollno(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Course"
            className="dark2 text-white"
            onChange={(e) => setCourse(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Year"
            className="dark2 text-white"
            onChange={(e) => setYear(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Department"
            className="dark2 text-white"
            onChange={(e) => setDept(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="Purpose"
            className="dark2 text-white"
            onChange={(e) => setPuropse(e.target.value)}
          />
          <br />
          <Button onClick={Submit} variant="warning">
            Request a bonafide
          </Button>
        </>
      )}
    </>
  );
  return theme ? dark : light;
}
