import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { REGISTER_API } from "../../../env";

export default function LoginForm() {
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const handleChangeemail = (e) => setemail(e.target.value);
  const handleChangeName = (e) => setName(e.target.value);

  const submitForm = async (e) => {
    e.preventDefault();
    const cert = (new ApolloClient({
      cache: new InMemoryCache(),
      uri: REGISTER_API
    })).mutate({
      mutation: gql`
        mutation ($email: String, $name: String) {
          createProf(data: { email: $email, name: $name }) {
            certificate
          }
        }
      `,
      variables: {
        name,
        email
      }
    });
    console.log(cert);
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
