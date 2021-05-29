import { useMutation } from "@apollo/client";
import { ADD_STUDENT } from "../../graphql/mutations";
import { useState } from "preact/hooks";

import { Input } from "reactstrap";
import { Button } from "react-bootstrap";

import { route } from "preact-router";

// Note: `user` comes from the URL, courtesy of our router
const Add = () => {
  const [addStudent] = useMutation(ADD_STUDENT);

  const [q, setQ] = useState("");
  const [o1, setO1] = useState("");
  const [o2, setO2] = useState("");

  const cQ = (e) => setQ(e.target.value);
  const cO1 = (e) => setO1(e.target.value);
  const cO2 = (e) => setO2(e.target.value);

  const Submit = (e) => {
    e.preventDefault();
    addStudent({
      variables: {
        firstname: q,
        lastname: o1,
        rollnumber: o2,
      },
    })
      .then(route("/", true))
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Input
        className="dark2"
        type="text"
        placeholder="firstname"
        onInput={cQ}
      />
      <br />
      <Input
        className="dark2"
        type="text"
        placeholder="lastname"
        onInput={cO1}
      />
      <br />
      <Input
        className="dark2"
        type="text"
        placeholder="rollnumber"
        onInput={cO2}
      />
      <br />
      <center>
        <Button onClick={Submit} variant="warning">
          Create a student
        </Button>
      </center>
    </>
  );
};

export default Add;
