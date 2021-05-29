import { useEffect, useState } from "preact/hooks";
import { useSelector } from "react-redux";
import { Form, Input, FormGroup, Table } from "reactstrap";
import { Button } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { CREATECOURSE } from "../../../graphql/mutations";
import { PROFCOURSE } from "../../../graphql/query";

export default function Join() {
  const [subject, setSubject] = useState("");

  const [mutate, { data: datum }] = useMutation(CREATECOURSE);

  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const { data, loading } = useQuery(PROFCOURSE);
  const [elements, setElements] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setElements(
        data.profCourse.map((arr, index) => (
          <tr key={index}>
            <td>{arr.courseCode}</td>
          </tr>
        ))
      );
      setIsLoading(false);
    }
    if (datum) {
      console.log(datum);
      setElements([...elements, datum.createCourse.courseCode]);
    }
  }, [data, loading, datum, elements]);

  const changeSubject = (e) => {
    setSubject(e.target.value);
  };
  const submitForm = (e) => {
    e.preventDefault();
    mutate({
      variables: {
        courseCode: subject,
      },
    });
  };
  const light = (
    <div>
      <br />
      <h5>Create Course</h5>
      <Form>
        <FormGroup>
          <Input
            type="text"
            onChange={changeSubject}
            placeholder="Course Code"
          />
        </FormGroup>
        <Button variant="primary" type="submit" onClick={submitForm}>
          CREATE COURSE
        </Button>
      </Form>
      <br />
      <br />
      <h5>Classes Joined</h5>
      <Table striped bordered>
        <thead>
          <th>Class Name</th>
        </thead>
        {isLoading ? null : <tbody>{elements}</tbody>}
      </Table>
    </div>
  );
  const dark = (
    <div className="dark-color">
      <br />
      <h5>CREATE COURSE</h5>
      <Form>
        <FormGroup>
          <Input
            type="text"
            onChange={changeSubject}
            className="dark2 text-white"
            placeholder="Course Code"
          />
        </FormGroup>
        <Button variant="primary" type="submit" onClick={submitForm}>
          CREATE COURSE
        </Button>
      </Form>
      <br />
      <br />
      <h5 className="dark-color">Classes Joined</h5>
      <Table striped dark bordered>
        <thead>
          <th>Class Name</th>
        </thead>
        {isLoading ? null : <tbody>{elements}</tbody>}
      </Table>
    </div>
  );
  return theme ? dark : light;
}
