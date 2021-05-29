import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { CREATEPROF } from "../../../graphql/mutations";

export default function LoginForm() {
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const handleChangeemail = (e) => setemail(e.target.value);
  const handleChangeName = (e) => setName(e.target.value);
  const [mutate] = useMutation(CREATEPROF);
  const submitForm = async (e) => {
    e.preventDefault();
    mutate({ variables: { name, email } });
  };

  return (
    <div className="form-box vertical-center">
      <h1>Professor Portal</h1>
      <hr />
      <Form method="post">
        <Form.Group>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChangeemail}
            placeholder="Enter Email Address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            name="name"
            onChange={handleChangeName}
            placeholder="Enter Name"
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={submitForm}>
          Register
        </Button>
      </Form>
      <hr />
    </div>
  );
}
