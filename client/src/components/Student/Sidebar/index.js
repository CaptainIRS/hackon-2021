import { useSelector } from "react-redux";
import { useState, useEffect } from "preact/hooks";
import { Image } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { STUDENT } from "../../../graphql/query";
import noprof from "../../../assets/images/noprofilepic.png";
export default function Sidebar() {
  const user = useSelector((state) => state.user);
  const { data, loading } = useQuery(STUDENT);

  const [prof, setProf] = useState();

  const [IsLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (loading) setIsLoading(true);
    if (data) {
      setProf(data.studentDetails);
      setIsLoading(false);
    }
  }, [data, loading]);

  const theme = user.theme;

  const dark = (
    <div className="text-center dark-color">
      <br />
      <h1>Profile</h1>
      <br />
      <Image src={noprof} roundedCircle className="profilePic light2" />
      <hr className="hr-dark" />
      {IsLoading ? null : (
        <>
          <h4>{prof.name}</h4>
          <h6>{prof.email}</h6>
        </>
      )}
    </div>
  );

  const light = (
    <div className="text-center">
      <br />
      <h1>Profile</h1>
      <br />
      <Image src={noprof} roundedCircle className="profilePic light2" />
      <hr />
      {IsLoading ? null : (
        <>
          <h4>{prof.name}</h4>
          <h6>{prof.email}</h6>
        </>
      )}
    </div>
  );
  return theme ? dark : light;
}
